from typing import TypedDict, Literal


class SuccessMessage(TypedDict):
    type: Literal["success"]
    result: dict[str, None]