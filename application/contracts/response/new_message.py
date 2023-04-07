from typing import TypedDict, Literal
from application.contracts.branch_type import BranchType


class NewMessageResult(TypedDict):
    nickname: str
    text: str
    time: str
    id: int
    status: Literal["admin"] | Literal["user"]
    branch: BranchType
    ip: str


class NewMessage(TypedDict):
    type: Literal["new message"]
    result: list[NewMessageResult]
