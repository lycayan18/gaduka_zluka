from typing import TypedDict, Literal


class AuthorizeUserMessage(TypedDict):
    type: Literal["authorize user"]
    id: int
    result: bool