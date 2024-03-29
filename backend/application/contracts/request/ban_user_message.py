from typing import TypedDict, Literal


class BanUserMessageParameters(TypedDict):
    ip: str


class BanUserMessage(TypedDict):
    type: Literal["ban user"]
    parameters: BanUserMessageParameters
