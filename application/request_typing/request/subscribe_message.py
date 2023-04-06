from typing import TypedDict, Literal
from application.request_typing.branch import BranchType


class SubscribeMessageParameters(TypedDict):
    branch: BranchType


class SubscribeMessage(TypedDict):
    type: Literal["subscribe"]
    parameters: SubscribeMessageParameters
