from typing import TypedDict, Literal


class SetTokenMessageResult(TypedDict):
    token: str


class SetTokenMessage(TypedDict):
    type: Literal["set token"]
    id: int
    result: SetTokenMessageResult