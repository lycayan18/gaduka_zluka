from typing import TypedDict, Literal
from application.contracts.branch_type import BranchType


class SubscribeMessageParameters(TypedDict):
    branch: BranchType


class SubscribeMessage(TypedDict):
    type: Literal["subscribe"]
    parameters: SubscribeMessageParameters
