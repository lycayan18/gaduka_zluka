from typing import TypedDict, Literal


class AuthRandNewParticipantMessageResult(TypedDict):
    nickname: str


class AuthRandNewParticipantMessage(TypedDict):
    type: Literal["new participant"]
    result: AuthRandNewParticipantMessageResult
