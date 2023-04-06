from typing import TypedDict, Literal
from application.request_typing.branch import Branch


class SubscribeAdminMessageParameters(TypedDict):
    branches: list[Branch]


class SubscribeAdminMessage(TypedDict):
    type: Literal["subscribe admin"]
    parameters: SubscribeAdminMessageParameters