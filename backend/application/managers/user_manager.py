from typing import Optional, Union

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

    def get_token_by_sid(self, sid: str) -> Optional[str]:
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

    def get_token(self, sid: str, login: str, password: str, message_id: int) -> Union[SetTokenMessage, ErrorMessageWithId]:
        token = generate_token(login=login, password=password)
        if not self.database.get_user_data(token=token):
            error = create_error_response(message_id=message_id, message='Неверный логин или пароль',
                                          error_type='invalid credentials')

            return error

        else:
            response = create_set_token_response(message_id=message_id, token=token)
            self.authorize_user(sid=sid, token=token)
            return response

    def get_user_data(self, token: str, message_id: int) -> SetUserDataMessage:
        user = self.database.get_user_data(token=token)
        if user:
            response = create_set_user_data_response(message_id=message_id, nickname=user.nickname)

        else:
            response = create_set_user_data_response(message_id=message_id, nickname='')
        return response

    def create_account(self, nickname: str, login: str, password: str, message_id: int, sid: str) -> Union[SetTokenMessage, ErrorMessageWithId]:
        token = generate_token(login, password)
        if (len(nickname) < 2 or len(nickname) > 40) or (len(login) < 4 or len(login) > 40) or (len(password) < 5 or len(password) > 80):
            response = create_error_response(message_id=message_id, message='invalid credentials', error_type='invalid credentials')

        elif self.database.get_user_data(token=token):
            response = create_error_response(message_id=message_id, message='Логин уже используется',
                                             error_type='login already used')

        elif self.database.get_user_data(nickname=nickname):
            response = create_error_response(message_id=message_id, message='Никнейм уже используется',
                                             error_type='nickname already used')

        else:
            response = create_set_token_response(message_id=message_id, token=token)

            status = 'admin' if nickname.lower() in ['drakutont', 'dungybug'] else 'user'
            self.database.add_user(token=token, nickname=nickname, status=status)
            self.authorize_user(sid=sid, token=token)

        return response
