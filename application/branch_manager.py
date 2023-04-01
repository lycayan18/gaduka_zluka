from flask import request
from typing import Callable

from application.branches.anon_branch import AnonBranch
from application.branches.auth_branch import AuthBranch
from application.branches.anon_rand_branch import AnonRandBranch
from application.branches.auth_rand_branch import AuthRandBranch
from application.message_manager import MessageManager
from application.sid_manager import SidManager
from application.user_manager import UserManager

from database.database_manager import *


class BranchManager:
    def __init__(self, database: DatabaseManager, user_manager: UserManager, sid_manager: SidManager):
        self.database = database
        self.user_manager = user_manager
        self.sid_manager = sid_manager

        self.anon_branch = AnonBranch(self.database)
        self.auth_branch = AuthBranch(self.database)
        self.anon_rand_branch = AnonRandBranch(self.database)
        self.auth_rand_branch = AuthRandBranch(self.database, self.user_manager)

        self.branches = {
            '/anon': self.anon_branch,
            '/auth': self.auth_branch,
            '/anon/rand': self.anon_rand_branch,
            '/auth/rand': self.auth_rand_branch
        }

        self.message_manager = MessageManager(branches=self.branches, user_manager=self.user_manager, sid_manager=self.sid_manager)

    def disconnect_user_from_branch(self, sid: str, callback: Callable):
        for branch in self.branches.values():
            branch.disconnect_client(sid, callback=callback)

    def handle_message(self, ip: str,  sid: str, query: dict, callback: Callable):
        self.message_manager.handle_message(ip=ip, sid=sid, query=query, callback=callback)