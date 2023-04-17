from typing import TypedDict, Literal, Union


class NewParticipantMessageResult(TypedDict):
    nickname: str


class NewParticipantMessage(TypedDict):
    type: Literal["new participant"]
    result: Union[dict[str, None], NewParticipantMessageResult]