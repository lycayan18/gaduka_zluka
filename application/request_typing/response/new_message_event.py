from typing import TypedDict, Literal
from application.request_typing.branch import BranchType


class NewMessageEventResult(TypedDict):
    nickname: str
    text: str
    time: int
    id: int
    status: Literal["admin"] | Literal["user"]
    branch: BranchType
    ip: str


class NewMessageEvent(TypedDict):
    type: Literal["new message"]
    result: list[NewMessageEventResult]
