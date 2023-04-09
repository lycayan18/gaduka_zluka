from typing import TypedDict, Literal, Union


class BaseSendChatMessageParameters(TypedDict):
    text: str


class AnonSendChatMessageParameters(BaseSendChatMessageParameters):
    nickname: str
    branch: Union[Literal["/anon"], Literal["/anon/rand"]]


class AuthSendChatMessageParameters(BaseSendChatMessageParameters):
    branch: Union[Literal["/auth"],  Literal["/auth/rand"]]


class BaseSendChatMessage(TypedDict):
    type: Literal["send"]


class AnonSendChatMessage(BaseSendChatMessage):
    parameters: AnonSendChatMessageParameters


class AuthSendChatMessage(BaseSendChatMessage):
    parameters: AuthSendChatMessageParameters
