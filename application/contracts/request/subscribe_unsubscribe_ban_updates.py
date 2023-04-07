from typing import TypedDict, Literal


class SubscribeUnsubscribeBanUpdatesMessage(TypedDict):
    type: Literal["subscribe ban updates"] | Literal["unsubscribe ban updates"]
    parameters: dict[str, str]