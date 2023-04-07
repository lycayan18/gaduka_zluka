from application.contracts.response_message import ResponseMessage
from typing import Protocol, Optional


class FlaskSendCallback(Protocol):
    def __call__(self, message: ResponseMessage, to: Optional[str | list[str]] = None, broadcast: Optional[bool] = None) -> None:
        ...