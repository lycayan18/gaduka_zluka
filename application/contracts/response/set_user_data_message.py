from typing import TypedDict, Literal


class SetUserDataMessageResult(TypedDict):
    nickname: str


class SetUserDataMessage(TypedDict):
    type: Literal["set user data"]
    id: int
    result: SetUserDataMessageResult