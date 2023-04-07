from typing import TypedDict, Literal


class GetBannedIpsMessage(TypedDict):
    type: Literal["get banned ips"]
    id: int
    parameters: dict[str, str]
