from typing import TypedDict, Literal


class SetBannedIpsMessageResult(TypedDict):
    ips: list[str]


class SetBannedIpsMessage(TypedDict):
    type: Literal["set banned ips"]
    id: int
    result: SetBannedIpsMessageResult