from typing import TypedDict, Literal
from application.request_typing.branch import BranchType


class DeleteMessageParameters(TypedDict):
    id: int
    branch: BranchType


class DeleteMessage(TypedDict):
    type: Literal["delete message"]
    parameters: DeleteMessageParameters
