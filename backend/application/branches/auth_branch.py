import datetime
from application.contracts.flask_send_callback import FlaskSendCallback

from application.contracts.request.send_chat_message import AuthSendChatMessage
from application.branches.base_branch import BaseBranch
from application.contracts.response.new_message import NewMessage
from application.managers.user_manager import UserManager
from database.database_manager import DatabaseManager
from application.utils.responses import create_new_message_response, create_message, \
    create_delete_message_event_response, create_error_response


class AuthBranch(BaseBranch):
    def __init__(self, database: DatabaseManager, user_manager: UserManager):
        super(AuthBranch, self).__init__(database, user_manager)

    def get_latest_messages(self) -> NewMessage:
        response: NewMessage = {
            "type": "new message",
            "result": []}

        last_messages = self.database.get_latest_message_from_auth()
        for item in last_messages:
            message = create_message(message_id=item.id, nickname=self.database.get_user_data(token=item.token).nickname, text=item.text,
                                     time=item.time, branch='/auth', ip=item.ip, status=item.status, reply_to=item.reply_to)
            response['result'].append(message)

        return response

    def add_message_to_database(self, **params):
        self.database.add_message_to_auth(**params)

    def delete_message(self, message_id: int, callback: FlaskSendCallback, **params):
        if self.user_manager.is_user_admin(params['sid']):
            self.database.delete_message_from_auth(message_id=message_id)
            callback(create_delete_message_event_response(message_id=message_id, branch='/auth'), to=self.clients)

    def handle_message(self, query: AuthSendChatMessage, callback: FlaskSendCallback, **params):
        token = self.user_manager.get_token_by_sid(params['sid'])
        ip = params.get('ip', '0.0.0.0')
        status = self.user_manager.get_user_status(token=token)
        if token:
            self.add_message_to_database(time=f'{datetime.datetime.now()}', text=query['parameters']['text'],
                                         token=token, ip=ip, status=status, reply_to=query['parameters'].get('replyTo'))

            response = create_new_message_response(message_id=self.database.get_latest_id_from_auth(),
                                                   nickname=self.database.get_user_data(token=token).nickname,
                                                   text=query['parameters']['text'],
                                                   time=f'{datetime.datetime.now()}', branch='/auth', ip=ip,
                                                   status=status,
                                                   reply_to=query['parameters'].get('replyTo'))

            callback(response, to=self.clients)
        else:
            callback(create_error_response(message_id=None, message='not authorized', error_type='not authorized'))
