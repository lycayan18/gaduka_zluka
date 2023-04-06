from typing import Callable
import datetime

from application.branches.branch import Branch
from application.request_typing.request.send_chat_message import AnonSendChatMessage
from application.request_typing.response.new_message import NewMessage
from application.managers.user_manager import UserManager
from database.database_manager import DatabaseManager
from application.utils.responses import create_message, create_delete_message_event_response, create_new_message_response


class AnonBranch(Branch):
    def __init__(self, database: DatabaseManager, user_manager: UserManager):
        super(AnonBranch, self).__init__(database, user_manager)

    def get_latest_messages(self) -> dict:
        response: NewMessage = {
            "type": "new message",
            "result": []}

        last_messages = self.database.get_latest_message_from_anon()
        for item in last_messages:
            message = create_message(message_id=item.id, nickname=item.nickname, text=item.text, time=item.time, branch='/anon',
                                     ip=item.ip, status=item.status)
            response['result'].append(message)

        return response

    def add_message_to_database(self, **params):
        self.database.add_message_to_anon(**params)

    def delete_message(self, message_id: int, callback: Callable, **params):
        if self.user_manager.is_user_admin(params['sid']):
            self.database.delete_message_from_anon(message_id=message_id)
            callback(create_delete_message_event_response(message_id=message_id, branch='/anon'), to=self.clients)

    def handle_message(self, query: AnonSendChatMessage, callback: Callable, **params):
        ip = params.get('ip')

        # Extra type checks for mypy
        if ip is None or not isinstance(ip, str):
            return

        status = 'admin' if query['parameters']['nickname'] in ['drakutont', 'dungybug'] and self.user_manager.is_user_admin(sid=params['sid']) else 'user'

        self.add_message_to_database(time=f'{datetime.datetime.now()}', text=query['parameters']['text'],
                                     nickname=query['parameters']['nickname'], ip=ip, status=status)

        response = create_new_message_response(message_id=self.database.get_latest_id_from_anon(), nickname=query['parameters']['nickname'],
                                               text=query['parameters']['text'], time=f'{datetime.datetime.now()}',
                                               branch='/anon', ip=ip, status=status)

        callback(response, to=self.clients)
