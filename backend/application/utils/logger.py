import json
from datetime import datetime
from typing import Any


def log_message(message: Any):
    log_file = open("log.txt", "a")

    print(f"[{datetime.now()}]:", json.dumps(message), file=log_file)

    log_file.close()
