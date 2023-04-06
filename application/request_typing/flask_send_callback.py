from application.request_typing.response_message import ResponseMessage
from typing import Callable

FlaskSendCallback = Callable[[ResponseMessage], None]