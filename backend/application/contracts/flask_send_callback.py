from application.contracts.response_message import ResponseMessage
from typing import Protocol, Optional, Union


class FlaskSendCallback(Protocol):
    def __call__(self, message: ResponseMessage, to: Optional[Union[str, list[str]]] = None, broadcast: Optional[bool] = None) -> None:
        ...