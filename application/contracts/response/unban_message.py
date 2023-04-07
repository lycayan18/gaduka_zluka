from typing import TypedDict, Literal


class UnbanMessage(TypedDict):
    type: Literal["unbanned"]
    result: dict[str, str]
