from flask import Flask, request
from flask_socketio import SocketIO
from application import main_handlers
from application.anon_branch import AnonBranch
from application.auth_branch import AuthBranch


class App:
    def __init__(self):
        self.app = Flask(__name__)
        self.socketio = SocketIO(self.app, logger=True)

        self.anon_branch = AnonBranch()
        self.auth_branch = AuthBranch()

        self.branches = {
            '/anon': self.anon_branch,
            '/auth': self.auth_branch
        }

    def handle_message(self, query: dict):
        print(query)
        if query['type'] == 'subscribe':
            sid = request.sid
            for branch in self.branches.values():
                branch.disconnect_client(sid)
            self.branches[query['parameters']['branch']].connect_client(sid)

        elif query['type'] == 'send':
            self.branches[query['parameters']['branch']].handle_message(query)

    def register_handlers(self):
        main_handlers.register_main_handlers(self.app)
        self.socketio.on_event(message='message', handler=self.handle_message)

    def run(self):
        self.register_handlers()
        self.socketio.run(self.app, host='127.0.0.1', port=8080, debug=True)