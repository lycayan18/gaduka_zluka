from flask_socketio import send


class AbstractBranch:
    def __init__(self):
        self.clients = []

    def get_user_data(self, token: str) -> dict:
        # TODO: запрос к бд
        pass

    def connect_client(self, sid: str):
        self.clients.append(sid)
        new_data = self.get_latest_messages()
        send(new_data)

    def disconnect_client(self, sid: str):
        if sid in self.clients:
            self.clients.remove(sid)

    def get_latest_messages(self) -> dict:
        pass

    def add_message_to_database(self, message):
        pass

    def handle_message(self, query: dict):
        pass
