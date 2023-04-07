from typing import TypedDict, Literal


class UnauthorizeUserMessage(TypedDict):
    type: Literal["unauthorize user"]
    parameters: dict[str, str]