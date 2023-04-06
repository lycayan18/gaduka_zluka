from typing import TypedDict, Literal
from application.request_typing.branch import Branch


class DeleteMessageEventResult(TypedDict):
    id: int
    branch: Branch


class DeleteMessageEvent(TypedDict):
    type: Literal["delete message event"]
    result: DeleteMessageEventResult
