from typing import TypedDict, Literal


class AuthorizeUserMessageParameters(TypedDict):
    token: str


class AuthorizeUserMessage(TypedDict):
    type: Literal["authorize user"]
    id: int
    parameters: AuthorizeUserMessageParameters
