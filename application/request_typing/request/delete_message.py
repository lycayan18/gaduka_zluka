from typing import TypedDict, Literal
from application.request_typing.branch import Branch


class DeleteMessageParameters(TypedDict):
    id: int
    branch: Branch


class DeleteMessage(TypedDict):
    type: Literal["delete message"]
    parameters: DeleteMessageParameters