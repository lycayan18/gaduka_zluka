from typing import TypedDict, Literal
from application.contracts.branch_type import BranchType
from application.contracts.user_status import UserStatus


class NewMessageResult(TypedDict):
    nickname: str
    text: str
    time: str
    id: int
    status: UserStatus
    branch: BranchType
    ip: str


class NewMessage(TypedDict):
    type: Literal["new message"]
    result: list[NewMessageResult]
