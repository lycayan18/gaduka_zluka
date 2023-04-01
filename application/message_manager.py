from typing import Callable

from application.sid_manager import SidManager
from application.user_manager import UserManager
from application.utils.responses import *
from application.branches.branch import Branch
from encryption.hashing import generate_token


class MessageManager:
    def __init__(self, branches: dict[str, Branch], user_manager: UserManager, sid_manager: SidManager):
        self.branches = branches
        self.user_manager = user_manager
        self.sid_manager = sid_manager

    def handle_message(self, ip: str, sid: str, query: dict, callback: Callable):
        query_parameters = query['parameters']

        if query['type'] == 'subscribe':
            for branch in self.branches.values():
                branch.disconnect_client(sid, callback=callback)

            self.branches[query['parameters']['branch']].connect_client(sid, callback=callback)

        elif query['type'] == 'send':
            if not self.sid_manager.is_ip_banned(ip=ip):
                token = self.user_manager.get_token_by_sid(sid)
                self.branches[query['parameters']['branch']].handle_message(query, callback=callback, token=token, sid=sid, ip=ip)
            else:
                callback(create_error_response(message_id=0, message='You was banned', error_type='banned'), to=sid)

        elif query['type'] == 'unsubscribe all':
            for branch in self.branches.values():
                branch.disconnect_client(sid, callback=callback)

        elif query['type'] == 'get token':
            token = generate_token(login=query['parameters']['login'], password=query['parameters']['password'])
            response = self.user_manager.get_token(token=token, message_id=query['id'])
            callback(response, to=sid)

        elif query['type'] == 'create account':
            response = self.user_manager.create_account(nickname=query_parameters['nickname'],
                                                        login=query_parameters['login'],
                                                        password=query_parameters['password'], message_id=query['id'])
            callback(response, to=sid)

        elif query['type'] == 'get user data':
            callback(self.user_manager.get_user_data(token=query_parameters['token'], message_id=query['id']), to=sid)

        elif query['type'] == 'authorize user':
            response = create_authorize_user_response(message_id=query['id'],
                                                      result=self.user_manager.authorize_user(sid, token=query_parameters['token']))
            callback(response, to=sid)

        elif query['type'] == 'unauthorize user':
            for branch in self.branches.values():
                branch.disconnect_client(sid, callback=callback)
            self.user_manager.unauthorize_user(sid)

        elif query['type'] == 'subscribe admin':
            for branch in self.branches.values():
                branch.disconnect_client(sid, callback=callback)

            for branch in query['parameters']['branches']:
                self.branches[branch].connect_client(sid, callback=callback)

        elif query['type'] == 'ban user':
            if query_parameters['password'] == '':
                if not self.sid_manager.is_ip_banned(ip=query_parameters['ip']):
                    self.sid_manager.ban_user(ip=query_parameters['ip'])

                    callback(create_error_response(message_id=0, message='You was banned', error_type='banned'),
                             to=self.sid_manager.get_sid_by_ip(ip=query_parameters['ip']))

        elif query['type'] == 'get banned ips':
            callback(create_set_banned_ips_response(ips=self.sid_manager.get_banned_ips(), message_id=query['id']))

        elif query['type'] == 'unban':
            if query_parameters['password'] == '':
                if self.sid_manager.is_ip_banned(ip=query_parameters['ip']):
                    self.sid_manager.unban_user(ip=query_parameters['ip'])

                    callback(create_unban_response(), to=self.sid_manager.get_sid_by_ip(ip=query_parameters['ip']))



