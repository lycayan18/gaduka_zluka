from typing import TypedDict, Literal

LogMessageType = Literal["info"] | Literal["debug"] | Literal["warning"] | Literal["error"]


class LogMessageResult(TypedDict):
    message: str
    type: LogMessageType


class LogMessage(TypedDict):
    type: Literal["log message"]
    result: LogMessageResult