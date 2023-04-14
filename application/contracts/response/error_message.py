from typing import TypedDict, Literal, Union, Optional

ErrorType = Union[Literal["invalid credentials"],
                  Literal["invalid token"],
                  Literal["internal error"],
                  Literal["permission denied"],
                  Literal["nickname already used"],
                  Literal["login already used"],
                  Literal["banned"],
                  Literal["not authorized"]]


class ErrorMessageResult(TypedDict):
    message: str
    error_type: ErrorType


class ErrorMessage(TypedDict):
    type: Literal["error"]
    result: ErrorMessageResult


class ErrorMessageWithId(ErrorMessage):
    id: Optional[int]
