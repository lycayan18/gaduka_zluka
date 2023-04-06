from typing import TypedDict, Literal


class ErrorMessageResult(TypedDict):
    message: str
    error_type: str


class ErrorMessage(TypedDict):
    type: Literal["error"]
    id: int
    result: ErrorMessageResult