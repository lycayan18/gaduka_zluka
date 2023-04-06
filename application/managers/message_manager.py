from typing import Callable

from application.managers.sid_manager import SidManager
from application.managers.user_manager import UserManager
from application.managers.event_manager import EventManager
from application.utils.responses import *
from application.branches.branch import Branch
from encryption.hashing import generate_token


class MessageManager:
    def __init__(self, branches: dict[str, Branch], user_manager: UserManager, sid_manager: SidManager, event_manager: EventManager):
        self.branches = branches
        self.user_manager = user_manager
        self.sid_manager = sid_manager
        self.event_manager = event_manager

    def handle_message(self, ip: str, sid: str, query: dict, callback: Callable):
        query_parameters = query['parameters']
        match query['type']:
            case 'subscribe':
                for branch in self.branches.values():
                    branch.disconnect_client(sid, callback=callback)

                self.branches[query['parameters']['branch']].connect_client(sid, callback=callback)
                if self.sid_manager.is_ip_banned(ip=ip):
                    callback(create_error_response(message_id=0, message='You was banned', error_type='banned'), to=sid)

            case 'send':
                if not self.sid_manager.is_ip_banned(ip=ip):
                    token = self.user_manager.get_token_by_sid(sid)
                    self.branches[query_parameters['branch']].handle_message(query, callback=callback, token=token, sid=sid, ip=ip)
                else:
                    callback(create_error_response(message_id=0, message='You was banned', error_type='banned'), to=sid)

            case 'unsubscribe all':
                for branch in self.branches.values():
                    branch.disconnect_client(sid, callback=callback)

            case 'get token':
                token = generate_token(login=query['parameters']['login'], password=query['parameters']['password'])
                response = self.user_manager.get_token(token=token, message_id=query['id'])
                callback(response, to=sid)

            case 'create account':
                response = self.user_manager.create_account(nickname=query_parameters['nickname'],
                                                            login=query_parameters['login'],
                                                            password=query_parameters['password'],
                                                            message_id=query['id'])
                callback(response, to=sid)

            case 'get user data':
                callback(self.user_manager.get_user_data(token=query_parameters['token'], message_id=query['id']),
                         to=sid)

            case 'authorize user':
                response = create_authorize_user_response(message_id=query['id'],
                                                          result=self.user_manager.authorize_user(sid, token=
                                                          query_parameters['token']))
                callback(response, to=sid)

            case 'unauthorize user':
                self.branches['/auth/rand'].disconnect_client(sid=sid, callback=callback)
                self.user_manager.unauthorize_user(sid)

            case 'subscribe admin':
                for branch in self.branches.values():
                    branch.disconnect_client(sid, callback=callback)

                if self.user_manager.is_user_authorize(sid=sid) and self.user_manager.get_user_status(token=self.user_manager.get_token_by_sid(sid=sid)) == 'admin':
                    self.user_manager.add_to_admins(sid=sid)
                    callback(create_success_response(message_id=query['id']), to=sid)

                    for branch in query['parameters']['branches']:
                        self.branches[branch].connect_client(sid, callback=callback)
                else:
                    callback(create_error_response(message_id=query['id'], message='permission denied',
                                                   error_type='permission denied'))

            case 'ban user':
                if self.user_manager.is_user_admin(sid=sid):
                    if not self.sid_manager.is_ip_banned(ip=query_parameters['ip']):
                        self.sid_manager.ban_user(ip=query_parameters['ip'])

                        callback(create_ban_event_response(ip=query_parameters['ip']), to=self.event_manager.get_subscribed_sids_list('ban updates'))

                        if self.sid_manager.get_sid_by_ip(ip=query_parameters['ip']):
                            callback(create_error_response(message_id=0, message='You was banned', error_type='banned'),
                                     to=self.sid_manager.get_sid_by_ip(ip=query_parameters['ip']))

            case 'get banned ips':
                callback(create_set_banned_ips_response(ips=self.sid_manager.get_banned_ips(), message_id=query['id']))

            case 'unban':
                if self.user_manager.is_user_admin(sid=sid):
                    if self.sid_manager.is_ip_banned(ip=query_parameters['ip']):
                        self.sid_manager.unban_user(ip=query_parameters['ip'])

                        callback(create_unban_event_response(ip=query_parameters['ip']), to=self.event_manager.get_subscribed_sids_list('ban updates'))

                        if self.sid_manager.get_sid_by_ip(ip=query_parameters['ip']):
                            callback(create_unban_response(), to=self.sid_manager.get_sid_by_ip(ip=query_parameters['ip']))

            case 'subscribe ban updates':
                self.event_manager.subscribe(event='ban updates', sid=sid)

            case 'unsubscribe ban updates':
                self.event_manager.unsubscribe(event='ban updates', sid=sid)

            case 'delete message':
                if self.user_manager.is_user_admin(sid=sid):
                    self.branches[query_parameters['branch']].delete_message(message_id=query_parameters['id'], callback=callback, sid=sid)

