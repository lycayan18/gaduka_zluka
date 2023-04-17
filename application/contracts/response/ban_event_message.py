from typing import TypedDict, Literal


class BanEventMessageResult(TypedDict):
    ip: str


class BanEventMessage(TypedDict):
    type: Literal["ban event"]
    result: BanEventMessageResult