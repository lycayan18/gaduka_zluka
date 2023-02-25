from flask_socketio import send
from application.abstract_branch import AbstractBranch
import datetime


class AnonBranch(AbstractBranch):
    def __init__(self):
        super(AnonBranch, self).__init__()

    def get_latest_messages(self) -> dict:
        # TODO: забирать сообщения из базы данных
        new_data = {
            "type": "new message",
            "result": [{
                "nickname": '123',
                "text": '123',
                "time": f'{datetime.datetime.now()}'
            }]
        }

        return new_data

    def add_message_to_database(self, message):
        pass

    def handle_message(self, query: dict):
        for client in self.clients:
            new_data = {
                "type": "new message",
                "result": [{
                    "nickname": query['parameters']['nickname'],
                    "text": query['parameters']['text'],
                    "time": f'{datetime.datetime.now()}'
                }]
            }
            send(new_data, to=client)
