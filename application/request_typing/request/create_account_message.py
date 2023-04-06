from typing import TypedDict, Literal


class CreateAccountMessageParameters(TypedDict):
    login: str
    password: str
    nickname: str


class CreateAccountMessage(TypedDict):
    type: Literal["create account"]
    id: int
    parameters: CreateAccountMessageParameters
