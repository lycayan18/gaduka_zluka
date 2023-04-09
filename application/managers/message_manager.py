from application.contracts.branch import Branch
from application.contracts.flask_send_callback import FlaskSendCallback
from application.managers.sid_manager import SidManager
from application.managers.user_manager import UserManager
from application.managers.event_manager import EventManager
from application.utils.responses import *
from application.contracts.branch_type import BranchType
from encryption.hashing import generate_token
from application.contracts.request_message import RequestMessage


class MessageManager:
    def __init__(self, branches: dict[BranchType, Branch], user_manager: UserManager, sid_manager: SidManager, event_manager: EventManager):
        self.branches = branches
        self.user_manager = user_manager
        self.sid_manager = sid_manager
        self.event_manager = event_manager

    def handle_message(self, ip: str, sid: str, query: RequestMessage, callback: FlaskSendCallback):
        if query['type'] == 'subscribe':
            for branch in self.branches.values():
                branch.disconnect_client(sid, callback=callback)

            self.branches[query['parameters']['branch']
                          ].connect_client(sid, callback=callback)
            if self.sid_manager.is_ip_banned(ip=ip):
                callback(create_error_response(
                    message_id=0, message='You was banned', error_type='banned'), to=sid)

        elif query['type'] == 'send':
            if not self.sid_manager.is_ip_banned(ip=ip):
                token = self.user_manager.get_token_by_sid(sid)
                self.branches[query['parameters']['branch']].handle_message(
                    query=query, callback=callback, token=token, sid=sid, ip=ip)
            else:
                callback(create_error_response(
                    message_id=0, message='You was banned', error_type='banned'), to=sid)

        elif query['type'] == 'unsubscribe all':
            for branch in self.branches.values():
                branch.disconnect_client(sid, callback=callback)

        elif query['type'] == 'get token':
            token = generate_token(
                login=query['parameters']['login'], password=query['parameters']['password'])
            response = self.user_manager.get_token(
                token=token, message_id=query['id'])

            self.user_manager.authorize_user(sid=sid, token=token)
            callback(response, to=sid)

        elif query['type'] == 'create account':
            response = self.user_manager.create_account(nickname=query['parameters']['nickname'],
                                                        login=query['parameters']['login'],
                                                        password=query['parameters']['password'],
                                                        message_id=query['id'],
                                                        sid=sid)
            callback(response, to=sid)

        elif query['type'] == 'get user data':
            callback(self.user_manager.get_user_data(token=query['parameters']['token'], message_id=query['id']),
                     to=sid)

        elif query['type'] == 'authorize user':
            response = create_authorize_user_response(message_id=query['id'],
                                                      result=self.user_manager.authorize_user(sid, token=query['parameters']['token']))
            callback(response, to=sid)

        elif query['type'] == 'unauthorize user':
            self.branches['/auth/rand'].disconnect_client(
                sid=sid, callback=callback)
            self.user_manager.unauthorize_user(sid)

        elif query['type'] == 'subscribe admin':
            for branch in self.branches.values():
                branch.disconnect_client(sid, callback=callback)

            if self.user_manager.is_user_authorize(sid=sid) and self.user_manager.get_user_status(token=self.user_manager.get_token_by_sid(sid=sid)) == 'admin':
                self.user_manager.add_to_admins(sid=sid)
                callback(create_success_response(message_id=query['id']), to=sid)

                for branch in query['parameters']['branches']:
                    self.branches[branch].connect_client(sid=sid, callback=callback)
            else:
                callback(create_error_response(message_id=query['id'], message='permission denied',
                                               error_type='permission denied'))

        elif query['type'] == 'ban user':
            if self.user_manager.is_user_admin(sid=sid):
                if not self.sid_manager.is_ip_banned(ip=query['parameters']['ip']):
                    self.sid_manager.ban_user(ip=query['parameters']['ip'])

                    callback(create_ban_event_response(
                        ip=query['parameters']['ip']), to=self.event_manager.get_subscribed_sids_list('ban updates'))

                    if self.sid_manager.get_sid_by_ip(ip=query['parameters']['ip']):
                        callback(create_error_response(message_id=0, message='You was banned', error_type='banned'),
                                 to=self.sid_manager.get_sid_by_ip(ip=query['parameters']['ip']))

        elif query['type'] == 'get banned ips':
            callback(create_set_banned_ips_response(
                ips=self.sid_manager.get_banned_ips(), message_id=query['id']))

        elif query['type'] == 'unban':
            if self.user_manager.is_user_admin(sid=sid):
                if self.sid_manager.is_ip_banned(ip=query['parameters']['ip']):
                    self.sid_manager.unban_user(
                        ip=query['parameters']['ip'])

                    callback(
                        create_unban_event_response(
                            query['parameters']['ip']),
                        to=self.event_manager.get_subscribed_sids_list('ban updates'))

                    if self.sid_manager.get_sid_by_ip(ip=query['parameters']['ip']):
                        callback(create_unban_response(), to=self.sid_manager.get_sid_by_ip(
                            ip=query['parameters']['ip']))

        elif query['type'] == 'subscribe ban updates':
            self.event_manager.subscribe(event='ban updates', sid=sid)

        elif query['type'] == 'unsubscribe ban updates':
            self.event_manager.unsubscribe(event='ban updates', sid=sid)

        elif query['type'] == 'delete message':
            if self.user_manager.is_user_admin(sid=sid):
                self.branches[query['parameters']['branch']].delete_message(
                    message_id=query['parameters']['id'], callback=callback, sid=sid)
