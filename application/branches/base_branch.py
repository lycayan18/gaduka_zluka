from typing import Callable, List

from application.contracts.response.new_message import NewMessage
from application.managers.user_manager import UserManager
from database.database_manager import DatabaseManager


class BaseBranch:
    def __init__(self, database: DatabaseManager, user_manager: UserManager):
        self.clients: List[str] = []
        self.database = database
        self.user_manager = user_manager

    def connect_client(self, sid: str, callback: Callable):
        self.clients.append(sid)
        new_data = self.get_latest_messages()
        callback(new_data, to=sid)

    def disconnect_client(self, sid: str, callback: Callable):
        if sid in self.clients:
            self.clients.remove(sid)

    def delete_message(self, message_id: int, callback: Callable, **params):  # method will be redefined by the heirs
        raise NotImplementedError()

    def add_message_to_database(self, **params):  # method will be redefined by the heirs
        raise NotImplementedError()

    def get_latest_messages(self) -> NewMessage:  # method will be redefined by the heirs
        raise NotImplementedError()
