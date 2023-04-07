from typing import Callable
import datetime

from application.contracts.request.send_chat_message import AuthSendChatMessage
from application.contracts.response_message import ResponseMessage
from application.branches.rand_branch import RandBranch
from application.managers.user_manager import UserManager
from database.database_manager import DatabaseManager
from application.contracts.flask_send_callback import FlaskSendCallback
from application.utils.responses import *


class AuthRandBranch(RandBranch):
    def __init__(self, database: DatabaseManager, user_manager: UserManager):
        super(AuthRandBranch, self).__init__(database, user_manager)

    def handle_message(self, query: AuthSendChatMessage, callback: FlaskSendCallback, **params):
        sid_1, sid_2 = self.get_two_users_sid(sid=params['sid']) or ('', '')  # shut up mypy

        token = params.get('token')

        # Extra type checks for mypy
        if token is None or not isinstance(token, str):
            return

        status = self.user_manager.get_user_status(token=token)

        response = create_new_message_response(message_id=0,  # a constant value is used because it doesn't matter in this branch
                                               nickname=self.database.get_user_data(token=params['token']).nickname,
                                               text=query['parameters']['text'], time=f'{datetime.datetime.now()}',
                                               branch='/auth/rand', ip=params['ip'], status=status)

        callback(response, to=[sid_1, sid_2])

    def try_connect_users(self, callback: FlaskSendCallback):
        if len(self.waiting_list) >= 2:
            try:
                self.connect_users(sid_1=self.waiting_list[0], sid_2=self.waiting_list[1], callback=callback)

                nickname_1 = self.database.get_user_data(
                    token=self.user_manager.get_token_by_sid(self.waiting_list[0])).nickname
                nickname_2 = self.database.get_user_data(
                    token=self.user_manager.get_token_by_sid(self.waiting_list[1])).nickname

                callback(create_auth_rand_new_participant_response(nickname=nickname_2), to=self.waiting_list[0])
                callback(create_auth_rand_new_participant_response(nickname=nickname_1), to=self.waiting_list[1])

                self.waiting_list.remove(self.waiting_list[0])
                self.waiting_list.remove(self.waiting_list[0])
            except AttributeError as e:  # a very rare error
                print(e)


