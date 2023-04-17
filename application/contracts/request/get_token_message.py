from typing import TypedDict, Literal


class GetTokenMessageParameters(TypedDict):
    login: str
    password: str


class GetTokenMessage(TypedDict):
    type: Literal["get token"]
    id: int
    parameters: GetTokenMessageParameters
