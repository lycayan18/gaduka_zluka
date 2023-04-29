from typing import TypedDict, Literal, Optional
from application.contracts.branch_type import BranchType
from application.contracts.user_status import UserStatus


class NewMessageResult(TypedDict):
    nickname: str
    text: str
    time: str
    id: Optional[int]
    status: UserStatus
    branch: BranchType
    ip: str
    replyTo: Optional[int]


class NewMessage(TypedDict):
    type: Literal["new message"]
    result: list[NewMessageResult]
