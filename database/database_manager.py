from flask_sqlalchemy import SQLAlchemy
from database.models import UsersModel, AuthBranchModel, AnonBranchModel, BlacklistModel


class DatabaseManager:
    def __init__(self, database: SQLAlchemy):
        self.database = database

    def add_user(self, **params):
        user = UsersModel(**params)
        self.database.session.add(user)
        self.database.session.commit()

    def add_message_to_anon(self, **params):
        message = AnonBranchModel(**params)
        self.database.session.add(message)
        self.database.session.commit()

    def add_message_to_auth(self, **params):
        message = AuthBranchModel(**params)
        self.database.session.add(message)
        self.database.session.commit()

    def add_ip_to_blacklist(self, ip):
        ip = BlacklistModel(ip=ip)
        self.database.session.add(ip)
        self.database.session.commit()

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
