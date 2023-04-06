from typing import TypedDict, Literal
from application.request_typing.branch import Branch


class SubscribeMessageParameters(TypedDict):
    branch: Branch


class SubscribeMessage(TypedDict):
    type: Literal["subscribe"]
    parameters: SubscribeMessageParameters