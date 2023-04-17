from typing import TypedDict, Literal


class SuccessMessage(TypedDict):
    type: Literal["success"]
    id: int
    result: dict[str, None]