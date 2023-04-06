from flask_sqlalchemy import SQLAlchemy
from database.models import UsersModel, AuthBranchModel, AnonBranchModel, BlacklistModel
from typing import Literal


class DatabaseManager:
    def __init__(self, database: SQLAlchemy, maximum_number: int):
        self.database = database
        self.maximum_number = maximum_number

    def checking_restriction(self):
        if len(AnonBranchModel.query.all()) > self.maximum_number:
            self.database.session.delete(AnonBranchModel.query.all()[0])
            self.database.session.commit()

        if len(AuthBranchModel.query.all()) > self.maximum_number:
            self.database.session.delete(AuthBranchModel.query.all()[0])
            self.database.session.commit()

    def add_user(self, **params):
        user = UsersModel(**params)
        self.database.session.add(user)
        self.database.session.commit()

    def add_message_to_anon(self, **params):
        message = AnonBranchModel(**params)
        self.database.session.add(message)
        self.database.session.commit()
        self.checking_restriction()

    def add_message_to_auth(self, **params):
        message = AuthBranchModel(**params)
        self.database.session.add(message)
        self.database.session.commit()
        self.checking_restriction()

    def add_ip_to_blacklist(self, ip):
        ip = BlacklistModel(ip=ip)
        self.database.session.add(ip)
        self.database.session.commit()

    def remove_from_blacklist(self, ip: str):
        ip = BlacklistModel.query.filter_by(ip=ip).first()
        self.database.session.delete(ip)
        self.database.session.commit()

    def delete_message_from_anon(self, message_id: int):
        message = AnonBranchModel.query.filter_by(id=message_id).first()
        self.database.session.delete(message)
        self.database.session.commit()

    def delete_message_from_auth(self, message_id: int):
        message = AuthBranchModel.query.filter_by(id=message_id).first()
        self.database.session.delete(message)
        self.database.session.commit()

    @staticmethod
    def get_user_status(token: str) -> Literal['user'] | Literal['admin']:
        return UsersModel.query.filter_by(token=token).first().status

    @staticmethod
    def is_user_banned(ip: str) -> bool:
        if BlacklistModel.query.filter_by(ip=ip).first():
            return True
        return False

    @staticmethod
    def get_banned_ips():
        return BlacklistModel.query.all()

    @staticmethod
    def get_user_data(**filter_params):
        return UsersModel.query.filter_by(**filter_params).first()

    @staticmethod
    def get_latest_message_from_auth():
        return AuthBranchModel.query.all()

    @staticmethod
    def get_latest_message_from_anon():
        return AnonBranchModel.query.all()

    @staticmethod
    def get_latest_id_from_anon() -> int:
        return AnonBranchModel.query.all()[-1].id

    @staticmethod
    def get_latest_id_from_auth() -> int:
        return AuthBranchModel.query.all()[-1].id