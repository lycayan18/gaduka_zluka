from typing import TypedDict, Literal, Any

class SubscribeUnsubscribeLogMessages(TypedDict):
    type: Literal["subscribe log messages", "unsubscribe log messages"]
    parameters: dict[str, Any]