from typing import TypedDict, Literal
from application.request_typing.branch import BranchType


class DeleteMessageEventResult(TypedDict):
    id: int
    branch: BranchType


class DeleteMessageEvent(TypedDict):
    type: Literal["delete message event"]
    result: DeleteMessageEventResult
