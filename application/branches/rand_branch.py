from typing import Callable
import datetime

from application.request_typing.request.send_chat_message import AnonSendChatMessage, AuthSendChatMessage
from application.request_typing.flask_send_callback import FlaskSendCallback
from application.branches.branch import Branch
from application.managers.user_manager import UserManager
from database.database_manager import DatabaseManager
from application.utils.responses import create_lost_participant_response
from typing import Optional


class RandBranch(Branch):
    def __init__(self, database: DatabaseManager, user_manager: UserManager):
        super(RandBranch, self).__init__(database, user_manager)
        self.waiting_list: list[str] = []
        self.connected_users: dict[str, str] = {}

    def connect_client(self, sid: str, callback: Optional[FlaskSendCallback] = None):
        if callback is None:
            # TODO: Do something with this?
            return

        self.clients.append(sid)
        self.add_to_waiting_list(sid=sid)

        self.try_connect_users(callback)

    def disconnect_client(self, sid: str, callback: Optional[FlaskSendCallback] = None):
        if callback is None:
            # TODO: Do something with this?
            return
        
        super(RandBranch, self).disconnect_client(sid)
        self.remove_from_waiting_list(sid)

        if self.get_interlocutor(sid=sid):
            interlocutor = self.get_interlocutor(sid=sid)

            if interlocutor is None:
                # TODO: Do something, when interlocutor is None
                return
            
            self.add_to_waiting_list(interlocutor)

        self.disconnect_users(sid, callback)

        self.try_connect_users(callback)

    def add_to_waiting_list(self, sid: str):
        self.waiting_list.append(sid)

    def remove_from_waiting_list(self, sid: str):
        if sid in self.waiting_list:
            self.waiting_list.remove(sid)

    def get_interlocutor(self, sid: str) -> Optional[str]:
        for key, value in self.connected_users.items():
            if key == sid:
                return value

            if value == sid:
                return key
            
        return None

    def get_two_users_sid(self, sid: str):
        for key, value in self.connected_users.items():
            if key == sid or value == sid:
                return key, value

    def connect_users(self, sid_1: str, sid_2: str, callback: Optional[FlaskSendCallback] = None):
        self.connected_users[sid_1] = sid_2

    def disconnect_users(self, sid: str, callback: FlaskSendCallback):
        for key, value in self.connected_users.items():
            if key == sid or value == sid:
                self.connected_users.pop(key)
                callback(create_lost_participant_response(), to=[key, value])
                break

    def try_connect_users(self, callback: Optional[FlaskSendCallback]):  # method will be redefined by the heirs
        raise NotImplementedError

    def handle_message(self, query: AnonSendChatMessage | AuthSendChatMessage, callback: Optional[FlaskSendCallback], **params):  # method will be redefined by the heirs
        raise NotImplementedError