from typing import TypedDict, Literal, Union


class SubscribeUnsubscribeBanUpdatesMessage(TypedDict):
    type: Union[Literal["subscribe ban updates"], Literal["unsubscribe ban updates"]]
    parameters: dict[str, str]