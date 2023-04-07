from typing import TypedDict, Literal


class UnsubscribeAllMessage(TypedDict):
    type: Literal["unsubscribe all"]
    parameters: dict[str, str]