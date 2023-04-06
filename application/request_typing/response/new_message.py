from typing import TypedDict, Literal, List

from application.request_typing.branch import BranchType


class NewMessageResult(TypedDict):
    id: int
    nickname: str
    text: str
    time: str
    branch: BranchType
    ip: str
    status: Literal["user"] | Literal["admin"]


class NewMessage(TypedDict):
    type: Literal["new message"]
    result: List[NewMessageResult]
