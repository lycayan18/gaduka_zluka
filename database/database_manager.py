from flask_sqlalchemy import SQLAlchemy
from database.models import UsersModel, AuthBranchModel, AnonBranchModel


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

    @staticmethod
    def get_user_data(**filter_params):
        user = UsersModel.query.filter_by(**filter_params).first()
        return user

    @staticmethod
    def get_latest_message_from_auth():
        last_messages = AuthBranchModel.query.all()
        return last_messages

    @staticmethod
    def get_latest_message_from_anon():
        last_messages = AnonBranchModel.query.all()
        return last_messages
