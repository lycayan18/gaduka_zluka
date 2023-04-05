from typing import Callable
import datetime

from application.branches.branch import Branch
from application.managers.user_manager import UserManager
from database.database_manager import DatabaseManager
from application.utils.responses import *


class RandBranch(Branch):
    def __init__(self, database: DatabaseManager, user_manager: UserManager):
        super(RandBranch, self).__init__(database, user_manager)
        self.waiting_list = []
        self.connected_users = {}

    def connect_client(self, sid: str, callback: Callable = None):
        self.clients.append(sid)
        self.add_to_waiting_list(sid=sid)

        self.try_connect_users(callback)

    def disconnect_client(self, sid: str, callback: Callable = None):
        super(RandBranch, self).disconnect_client(sid)
        self.remove_from_waiting_list(sid)
        self.disconnect_users(sid, callback)

        self.try_connect_users(callback)

    def add_to_waiting_list(self, sid: str):
        self.waiting_list.append(sid)

    def remove_from_waiting_list(self, sid: str):
        if sid in self.waiting_list:
            self.waiting_list.remove(sid)

    def get_two_users_sid(self, sid: str):
        for key, value in self.connected_users.items():
            if key == sid or value == sid:
                return key, value

    def connect_users(self, sid_1: str, sid_2: str, callback: Callable = None):
        self.connected_users[sid_1] = sid_2

    def disconnect_users(self, sid: str, callback: Callable):
        for key, value in self.connected_users.items():
            if key == sid or value == sid:
                self.connected_users.pop(key)
                callback(create_lost_participant_response(), to=[key, value])
                break

    def try_connect_users(self, callback: Callable):  # method will be redefined by the heirs
        pass
