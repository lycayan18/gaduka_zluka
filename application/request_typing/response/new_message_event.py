from typing import TypedDict, Literal
from messages.branch import Branch


class NewMessageEventResult(TypedDict):
    nickname: str
    text: str
    time: int
    id: int
    status: Literal["admin"] | Literal["user"]
    branch: Branch
    ip: str


class NewMessageEvent(TypedDict):
    type: Literal["new message"]
    result: list[NewMessageEventResult]