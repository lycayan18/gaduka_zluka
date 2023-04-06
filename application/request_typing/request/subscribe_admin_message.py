from typing import TypedDict, Literal
from application.request_typing.branch import BranchType


class SubscribeAdminMessageParameters(TypedDict):
    branches: list[BranchType]


class SubscribeAdminMessage(TypedDict):
    type: Literal["subscribe admin"]
    parameters: SubscribeAdminMessageParameters
