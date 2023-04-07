from typing import TypedDict, Literal

class LostParticipantMessage(TypedDict):
    type: Literal["lost participant"]
    result: dict[str, str]