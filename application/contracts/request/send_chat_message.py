from typing import TypedDict, Literal, Union, Optional


class BaseSendChatMessageParameters(TypedDict):
    text: str


class AnonSendChatMessageParameters(BaseSendChatMessageParameters):
    nickname: str
    replyTo: Optional[int]
    branch: Union[Literal["/anon"], Literal["/anon/rand"]]


class AuthSendChatMessageParameters(BaseSendChatMessageParameters):
    replyTo: Optional[int]
    branch: Union[Literal["/auth"],  Literal["/auth/rand"]]


class BaseSendChatMessage(TypedDict):
    type: Literal["send"]


class AnonSendChatMessage(BaseSendChatMessage):
    parameters: AnonSendChatMessageParameters


class AuthSendChatMessage(BaseSendChatMessage):
    parameters: AuthSendChatMessageParameters
