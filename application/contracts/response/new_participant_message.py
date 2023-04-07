from typing import TypedDict, Literal


class NewParticipantMessageResult(TypedDict):
    nickname: str


class NewParticipantMessage(TypedDict):
    type: Literal["new participant"]
    result: dict[str, None] | NewParticipantMessageResult