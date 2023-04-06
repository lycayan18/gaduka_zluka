from typing import TypedDict, Literal
from application.request_typing.branch import Branch


class BaseSendChatMessageParameters(TypedDict):
    text: str


class AnonSendChatMessageParameters(BaseSendChatMessageParameters):
    nickname: str
    branch: Literal["/anon"] | Literal["/anon/rand"]


class AuthSendChatMessageParameters(BaseSendChatMessageParameters):
    branch: Literal["/auth"] | Literal["/auth/rand"]


class BaseSendChatMessage(TypedDict):
    type: Literal["send"]


class AnonSendChatMessage(BaseSendChatMessage):
    parameters: AnonSendChatMessageParameters


class AuthSendChatMessage(BaseSendChatMessage):
    parameters: AuthSendChatMessageParameters