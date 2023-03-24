from typing import Callable

from database.database_manager import DatabaseManager


class AbstractBranch:
    def __init__(self, database: DatabaseManager):
        self.clients = []
        self.database = database

    def connect_client(self, sid: str, callback: Callable):
        self.clients.append(sid)
        new_data = self.get_latest_messages()
        callback(new_data, to=sid)

    def disconnect_client(self, sid: str):
        if sid in self.clients:
            self.clients.remove(sid)

    @staticmethod
    def get_latest_messages() -> dict:
        pass

    def add_message_to_database(self, **params):
        pass

    def handle_message(self, query: dict, callback: Callable, **params):
        pass
