from typing import Optional

from application.utils.responses import *
from database.database_manager import DatabaseManager
from encryption.hashing import generate_token


class UserManager:
    def __init__(self, database: DatabaseManager):
        self.database = database
        self.authorized_user: dict[str, str] = {}
        self.admins: List[str] = []

    def add_to_admins(self, sid: str) -> None:
        if sid in self.authorized_user.keys():
            self.admins.append(sid)

    def remove_from_admins(self, sid: str) -> None:
        if sid in self.admins:
            self.admins.remove(sid)

    def is_user_admin(self, sid: str) -> bool:
        return sid in self.admins

    def is_user_authorize(self, sid: str) -> bool:
        return sid in self.authorized_user.keys()

    def get_token_by_sid(self, sid: str) -> str | None:
        return self.authorized_user.get(sid, None)

    def authorize_user(self, sid: str, token: str) -> bool:
        if self.database.get_user_data(token=token):
            self.authorized_user[sid] = token
            return True

        return False

    def unauthorize_user(self, sid: str) -> None:
        self.authorized_user.pop(sid, None)

    def get_user_status(self, token: Optional[str]) -> UserStatus:
        if token is None:
            return 'user'
        return self.database.get_user_status(token=token)

    def get_token(self, token: str, message_id: int) -> SetTokenMessage | ErrorMessageWithId:
        if not self.database.get_user_data(token=token):
            error = create_error_response(message_id=message_id, message='Неверный логин или пароль',
                                          error_type='invalid credentials')

            return error

        else:
            response = create_set_token_response(message_id=message_id, token=token)

            return response

    def get_user_data(self, token: str, message_id: int) -> SetUserDataMessage:
        user = self.database.get_user_data(token=token)
        if user:
            response = create_set_user_data_response(message_id=message_id, nickname=user.nickname)

        else:
            response = create_set_user_data_response(message_id=message_id, nickname='')
        return response

    def create_account(self, nickname: str, login: str, password: str, message_id: int) -> SetTokenMessage | ErrorMessageWithId:
        if not (2 >= len(nickname) <= 40 or 5 >= len(login) <= 40 or 4 >= len(password) <= 40):
            error = create_error_response(message_id=message_id, message='invalid data', error_type='invalid data')
            return error

        token = generate_token(login, password)
        if self.database.get_user_data(token=token):
            error = create_error_response(message_id=message_id, message='Логин уже используется',
                                          error_type='login already used')
            return error

        elif self.database.get_user_data(nickname=nickname):
            error = create_error_response(message_id=message_id, message='Никнейм уже используется',
                                          error_type='nickname already used')
            return error

        else:
            response = create_set_token_response(message_id=message_id, token=token)

            status = 'admin' if nickname.lower() in ['drakutont', 'dungybug'] else 'user'
            self.database.add_user(token=token, nickname=nickname, status=status)

            return response
