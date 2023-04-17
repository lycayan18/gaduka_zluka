from application.contracts.flask_send_callback import FlaskSendCallback
from datetime import datetime
from typing import Any
import json


class LoggerManager:
    def __init__(self):
        self.subscribed_sids: list[str] = []

    def subscribe_logger(self, sid: str):
        self.subscribed_sids.append(sid)

    def unsubscribe_logger(self, sid: str):
        if sid not in self.subscribed_sids:
            return

        self.subscribed_sids.remove(sid)

    def log_message(self, message: Any, send: FlaskSendCallback):
        try:
            log_file = open("log.txt", "a")

            print(f"[{datetime.now()}]:", json.dumps(message), file=log_file)

            log_file.close()
        except Exception:
            pass

        for sid in self.subscribed_sids:
            send(message, to=sid)