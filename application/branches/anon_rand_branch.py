from typing import Callable
import datetime

from application.branches.rand_branch import RandBranch
from application.managers.user_manager import UserManager
from database.database_manager import DatabaseManager
from application.utils.responses import *


class AnonRandBranch(RandBranch):
    def __init__(self, database: DatabaseManager, user_manager: UserManager):
        super(AnonRandBranch, self).__init__(database, user_manager)

    def handle_message(self, query: dict, callback: Callable, **params):
        sid_1, sid_2 = self.get_two_users_sid(sid=params['sid'])
        status = 'admin' if query['parameters']['nickname'] in ['drakutont', 'dungybug'] and self.user_manager.is_user_admin(sid=params['sid']) else 'user'

        response = create_new_message_response(nickname=query['parameters']['nickname'],
                                               text=query['parameters']['text'], time=f'{datetime.datetime.now()}',
                                               branch='/anon/rand', ip=params['ip'], status=status)

        callback(response, to=[sid_1, sid_2])

    def try_connect_users(self, callback: Callable):
        if len(self.waiting_list) >= 2:
            self.connect_users(sid_1=self.waiting_list[0], sid_2=self.waiting_list[1], callback=callback)
            callback(create_anon_rand_new_participant_response(), to=[self.waiting_list[0], self.waiting_list[1]])