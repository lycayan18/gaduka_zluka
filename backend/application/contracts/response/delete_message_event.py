from typing import TypedDict, Literal
from application.contracts.branch_type import BranchType


class DeleteMessageEventResult(TypedDict):
    id: int
    branch: BranchType


class DeleteMessageEvent(TypedDict):
    type: Literal["delete message event"]
    result: DeleteMessageEventResult
