from typing import TypedDict, Literal


class UnbanEventMessageResult(TypedDict):
    ip: str


class UnbanEventMessage(TypedDict):
    type: Literal["unban event"]
    result: UnbanEventMessageResult