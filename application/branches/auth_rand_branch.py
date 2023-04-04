from typing import Callable
import datetime

from application.branches.rand_branch import RandBranch
from application.managers.user_manager import UserManager
from database.database_manager import DatabaseManager
from application.utils.responses import *


class AuthRandBranch(RandBranch):
    def __init__(self, database: DatabaseManager, user_manager: UserManager):
        super(AuthRandBranch, self).__init__(database)
        self.user_manager = user_manager

    def handle_message(self, query: dict, callback: Callable, **params):
        sid_1, sid_2 = self.get_two_users_sid(sid=params['sid'])
        response = create_new_message_response(
            nickname=self.database.get_user_data(token=params['token']).nickname,
            text=query['parameters']['text'], time=f'{datetime.datetime.now()}')

        callback(response, to=[sid_1, sid_2])

    def try_connect_users(self, callback: Callable):
        if len(self.waiting_list) >= 2:
            self.connect_users(sid_1=self.waiting_list[0], sid_2=self.waiting_list[1], callback=callback)
            print(self.user_manager.get_token_by_sid(self.waiting_list[0]))
            nickname_1 = self.database.get_user_data(token=self.user_manager.get_token_by_sid(self.waiting_list[0])).nickname
            nickname_2 = self.database.get_user_data(token=self.user_manager.get_token_by_sid(self.waiting_list[1])).nickname

            callback(create_auth_rand_new_participant_response(nickname=nickname_2), to=self.waiting_list[0])
            callback(create_auth_rand_new_participant_response(nickname=nickname_1), to=self.waiting_list[1])