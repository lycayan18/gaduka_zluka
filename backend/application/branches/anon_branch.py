import datetime

from application.branches.base_branch import BaseBranch
from application.contracts.flask_send_callback import FlaskSendCallback
from application.contracts.request.send_chat_message import AnonSendChatMessage
from application.contracts.response.new_message import NewMessage
from application.contracts.user_status import UserStatus
from application.managers.user_manager import UserManager
from database.database_manager import DatabaseManager
from application.utils.responses import create_message, create_delete_message_event_response, create_new_message_response


class AnonBranch(BaseBranch):
    def __init__(self, database: DatabaseManager, user_manager: UserManager):
        super(AnonBranch, self).__init__(database, user_manager)

    def get_latest_messages(self) -> NewMessage:
        response: NewMessage = {
            "type": "new message",
            "result": []}

        last_messages = self.database.get_latest_message_from_anon()
        for item in last_messages:
            message = create_message(message_id=item.id, nickname=item.nickname, text=item.text, time=item.time, branch='/anon',
                                     ip=item.ip, status=item.status, reply_to=item.reply_to)
            response['result'].append(message)

        return response

    def add_message_to_database(self, **params):
        self.database.add_message_to_anon(**params)

    def delete_message(self, message_id: int, callback: FlaskSendCallback, **params):
        if self.user_manager.is_user_admin(params['sid']):
            self.database.delete_message_from_anon(message_id=message_id)
            callback(create_delete_message_event_response(message_id=message_id, branch='/anon'), to=self.clients)

    def handle_message(self, query: AnonSendChatMessage, callback: FlaskSendCallback, **params):
        ip = params.get('ip')

        # Extra type checks for mypy
        if ip is None or not isinstance(ip, str):
            return

        status: UserStatus = 'admin' if query['parameters']['nickname'] in ['drakutont', 'dungybug'] and self.user_manager.is_user_admin(sid=params['sid']) else 'user'

        self.add_message_to_database(time=f'{datetime.datetime.now()}', text=query['parameters']['text'],
                                     nickname=query['parameters']['nickname'], ip=ip, status=status,
                                     reply_to=query['parameters'].get('replyTo'))

        response = create_new_message_response(message_id=self.database.get_latest_id_from_anon(), nickname=query['parameters']['nickname'],
                                               text=query['parameters']['text'], time=f'{datetime.datetime.now()}',
                                               branch='/anon', ip=ip, status=status,
                                               reply_to=query['parameters'].get('replyTo'))

        callback(response, to=self.clients)
