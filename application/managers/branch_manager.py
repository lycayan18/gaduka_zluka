from application.contracts.branch import Branch
from application.contracts.flask_send_callback import FlaskSendCallback
from application.contracts.request_message import RequestMessage
from application.branches.anon_branch import AnonBranch
from application.branches.auth_branch import AuthBranch
from application.branches.anon_rand_branch import AnonRandBranch
from application.branches.auth_rand_branch import AuthRandBranch
from application.managers.event_manager import EventManager
from application.managers.message_manager import MessageManager
from application.managers.sid_manager import SidManager
from application.managers.user_manager import UserManager
from application.contracts.branch_type import BranchType

from database.database_manager import *


class BranchManager:
    def __init__(self, database: DatabaseManager, user_manager: UserManager, sid_manager: SidManager):
        self.database = database
        self.user_manager = user_manager
        self.sid_manager = sid_manager
        self.event_manager = EventManager()

        self.anon_branch = AnonBranch(self.database, self.user_manager)
        self.anon_rand_branch = AnonRandBranch(self.database, self.user_manager)

        self.auth_branch = AuthBranch(self.database, self.user_manager)
        self.auth_rand_branch = AuthRandBranch(self.database, self.user_manager)

        self.branches: dict[BranchType, Branch] = {
            '/anon': self.anon_branch,
            '/auth': self.auth_branch,
            '/anon/rand': self.anon_rand_branch,
            '/auth/rand': self.auth_rand_branch
        }

        self.message_manager = MessageManager(branches=self.branches, user_manager=self.user_manager,
                                              sid_manager=self.sid_manager, event_manager=self.event_manager)

    def disconnect_user_from_branch(self, sid: str, callback: FlaskSendCallback):
        for branch in self.branches.values():
            branch.disconnect_client(sid, callback=callback)

        self.event_manager.remove_sid_from_all_events(sid=sid)
        self.user_manager.remove_from_admins(sid=sid)

    def handle_message(self, ip: str,  sid: str, query: RequestMessage, callback: FlaskSendCallback):
        self.message_manager.handle_message(ip=ip, sid=sid, query=query, callback=callback)
