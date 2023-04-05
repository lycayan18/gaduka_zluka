from typing import Union

from application.utils.responses import *
from database.database_manager import DatabaseManager
from encryption.hashing import generate_token


class UserManager:
    def __init__(self, database: DatabaseManager):
        self.database = database
        self.authorized_user = {}
        self.admins = []

    def add_to_admins(self, sid: str):
        self.admins.append(sid)

    def remove_from_admins(self, sid: str):
        if sid in self.admins:
            self.admins.remove(sid)

    def is_user_admin(self, sid: str) -> bool:
        return sid in self.admins

    def get_token_by_sid(self, sid: str) -> Union[str, None]:
        return self.authorized_user.get(sid, None)

    def authorize_user(self, sid: str, token: str) -> bool:
        if self.database.get_user_data(token=token):
            self.authorized_user[sid] = token
            return True

        return False

    def unauthorize_user(self, sid: str):
        self.authorized_user.pop(sid, None)

    def get_token(self, token: str, message_id: int) -> dict:
        if not self.database.get_user_data(token=token):
            error = create_error_response(message_id=message_id, message='Неверный логин или пароль',
                                          error_type='invalid credentials')

            return error

        else:
            response = create_set_token_response(message_id=message_id, token=token)

            return response

    def get_user_data(self, token: str, message_id: int) -> dict:
        user = self.database.get_user_data(token=token)
        if user:
            response = create_set_user_data_response(message_id=message_id, nickname=user.nickname)

        else:
            response = create_set_user_data_response(message_id=message_id, nickname='')
        return response

    def create_account(self, nickname: str, login: str, password: str, message_id: int) -> dict:
        token = generate_token(login, password)
        if self.database.get_user_data(token=token):
            error = create_error_response(message_id=message_id, message='login already used',
                                          error_type='login already used')
            return error

        elif self.database.get_user_data(nickname=nickname):
            error = create_error_response(message_id=message_id, message='nickname already used',
                                          error_type='nickname already used')
            return error

        else:
            response = create_set_token_response(message_id=message_id, token=token)

            self.database.add_user(token=token, nickname=nickname)

            return response
