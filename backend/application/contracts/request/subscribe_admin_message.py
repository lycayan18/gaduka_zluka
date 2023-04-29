from typing import TypedDict, Literal
from application.contracts.branch_type import BranchType


class SubscribeAdminMessageParameters(TypedDict):
    branches: list[BranchType]


class SubscribeAdminMessage(TypedDict):
    type: Literal["subscribe admin"]
    id: int
    parameters: SubscribeAdminMessageParameters
