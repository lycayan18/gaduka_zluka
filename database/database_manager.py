from flask_sqlalchemy import SQLAlchemy
from application.contracts.user_status import UserStatus
from database.models import UsersModel, AuthBranchModel, AnonBranchModel, BlacklistModel
from typing import Literal, List


class DatabaseManager:
    def __init__(self, database: SQLAlchemy, maximum_number: int):
        self.database = database
        self.maximum_number = maximum_number

    def checking_restriction(self) -> None:
        if len(AnonBranchModel.query.all()) > self.maximum_number:
            self.database.session.delete(AnonBranchModel.query.all()[0])
            self.database.session.commit()

        if len(AuthBranchModel.query.all()) > self.maximum_number:
            self.database.session.delete(AuthBranchModel.query.all()[0])
            self.database.session.commit()

    def add_user(self, **params) -> None:
        user = UsersModel(**params)
        self.database.session.add(user)
        self.database.session.commit()

    def add_message_to_anon(self, **params) -> None:
        message = AnonBranchModel(**params)
        self.database.session.add(message)
        self.database.session.commit()
        self.checking_restriction()

    def add_message_to_auth(self, **params) -> None:
        message = AuthBranchModel(**params)
        self.database.session.add(message)
        self.database.session.commit()
        self.checking_restriction()

    def add_ip_to_blacklist(self, ip) -> None:
        ip = BlacklistModel(ip=ip)
        self.database.session.add(ip)
        self.database.session.commit()

    def remove_from_blacklist(self, ip: str) -> None:
        ip = BlacklistModel.query.filter_by(ip=ip).first()
        self.database.session.delete(ip)
        self.database.session.commit()

    def delete_message_from_anon(self, message_id: int) -> None:
        message = AnonBranchModel.query.filter_by(id=message_id).first()
        self.database.session.delete(message)
        self.database.session.commit()

    def delete_message_from_auth(self, message_id: int) -> None:
        message = AuthBranchModel.query.filter_by(id=message_id).first()
        self.database.session.delete(message)
        self.database.session.commit()

    @staticmethod
    def get_user_status(token: str) -> UserStatus:
        return UsersModel.query.filter_by(token=token).first().status

    @staticmethod
    def is_user_banned(ip: str) -> bool:
        if BlacklistModel.query.filter_by(ip=ip).first():
            return True
        return False

    @staticmethod
    def get_banned_ips() -> List[BlacklistModel]:
        return BlacklistModel.query.all()

    @staticmethod
    def get_user_data(**filter_params) -> UsersModel:
        user_data = UsersModel.query.filter_by(**filter_params).first()
        if user_data:
            return user_data
        else:
            return UsersModel(nickname='', token='', status='user')

    @staticmethod
    def get_latest_message_from_auth() -> List[AuthBranchModel]:
        return AuthBranchModel.query.all()

    @staticmethod
    def get_latest_message_from_anon() -> List[AnonBranchModel]:
        return AnonBranchModel.query.all()

    @staticmethod
    def get_latest_id_from_anon() -> int:
        return AnonBranchModel.query.all()[-1].id

    @staticmethod
    def get_latest_id_from_auth() -> int:
        return AuthBranchModel.query.all()[-1].id