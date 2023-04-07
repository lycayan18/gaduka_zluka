from typing import TypedDict, Literal

class UnbanUserMessageParameters(TypedDict):
    ip: str


class UnbanUserMessage(TypedDict):
    type: Literal["unban"]
    parameters: UnbanUserMessageParameters