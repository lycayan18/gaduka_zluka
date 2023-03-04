from flask_sqlalchemy import SQLAlchemy
from database.models import UsersModel, AuthBranchModel, AnonBranchModel


def get_user_data(**filter_params):
    user = UsersModel.query.filter_by(**filter_params).first()
    return user


def add_user(session: SQLAlchemy, **params):
    user = UsersModel(**params)
    session.add(user)
    session.commit()


def get_latest_message_from_anon():
    last_messages = AnonBranchModel.query.all()
    return last_messages


def add_message_to_anon(session: SQLAlchemy, **params):
    message = AnonBranchModel(**params)
    session.add(message)
    session.commit()


def get_latest_message_from_auth():
    last_messages = AuthBranchModel.query.all()
    return last_messages


def add_message_to_auth(session: SQLAlchemy, **params):
    message = AuthBranchModel(**params)
    session.add(message)
    session.commit()