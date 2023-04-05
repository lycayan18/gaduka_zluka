from typing import Callable

from application.managers.user_manager import UserManager
from database.database_manager import DatabaseManager


class Branch:
    def __init__(self, database: DatabaseManager, user_manager: UserManager):
        self.clients = []
        self.database = database
        self.user_manager = user_manager

    def connect_client(self, sid: str, callback: Callable = None):
        self.clients.append(sid)
        new_data = self.get_latest_messages()
        callback(new_data, to=sid)

    def disconnect_client(self, sid: str, callback: Callable = None):
        if sid in self.clients:
            self.clients.remove(sid)

    def add_message_to_database(self, **params):  # method will be redefined by the heirs
        pass

    def handle_message(self, query: dict, callback: Callable, **params):  # method will be redefined by the heirs
        pass

    def get_latest_messages(self) -> dict:  # method will be redefined by the heirs
        pass
