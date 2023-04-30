import json
from os import environ
from datetime import datetime
from typing import Any


def log_message(message: Any):
    log_file = open(environ['LOG_FILE'], "a")

    print(f"[{datetime.now()}]:", json.dumps(message), file=log_file)

    log_file.close()
