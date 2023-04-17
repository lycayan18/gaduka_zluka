from typing import TypedDict, Literal


class GetUserDataMessageParameters(TypedDict):
    token: str


class GetUserDataMessage(TypedDict):
    type: Literal["get user data"]
    id: int
    parameters: GetUserDataMessageParameters