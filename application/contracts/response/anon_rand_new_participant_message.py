from typing import TypedDict, Literal


class AnonRandNewParticipantMessage(TypedDict):
    type: Literal["new participant"]
    result: dict[str, str]
