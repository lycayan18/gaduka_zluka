from typing import Callable

from flask_sqlalchemy import SQLAlchemy

from database.queries import get_user_data


class AbstractBranch:
    def __init__(self, database: SQLAlchemy):
        self.clients = []
        self.database = database

    @staticmethod
    def get_user_data(token: str) -> dict:
        user = get_user_data(token=token)
        response = {
            'nickname': user.nickname
        }

        return response

    def connect_client(self, sid: str, callback: Callable):
        self.clients.append(sid)
        new_data = self.get_latest_messages()
        callback(new_data, sid)

    def disconnect_client(self, sid: str):
        if sid in self.clients:
            self.clients.remove(sid)

    @staticmethod
    def get_latest_messages() -> dict:
        pass

    def add_message_to_database(self, message):
        pass

    def handle_message(self, query: dict, callback: Callable):
        pass
