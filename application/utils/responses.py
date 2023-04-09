from typing import List

from application.contracts.branch_type import BranchType
from application.contracts.response.error_message import ErrorMessageWithId
from application.contracts.response.set_token_message import SetTokenMessage
from application.contracts.response.set_user_data_message import SetUserDataMessage
from application.contracts.response.new_message import NewMessage, NewMessageResult
from application.contracts.response.authorize_user_message import AuthorizeUserMessage
from application.contracts.response.anon_rand_new_participant_message import AnonRandNewParticipantMessage
from application.contracts.response.auth_rand_new_participant_message import AuthRandNewParticipantMessage
from application.contracts.response.lost_participant_message import LostParticipantMessage
from application.contracts.response.set_banned_ips_message import SetBannedIpsMessage
from application.contracts.response.unban_event_message import UnbanEventMessage
from application.contracts.response.unban_message import UnbanMessage
from application.contracts.response.ban_event_message import BanEventMessage
from application.contracts.response.success_message import SuccessMessage
from application.contracts.response.delete_message_event import DeleteMessageEvent
from application.contracts.response.error_message import ErrorType
from application.contracts.user_status import UserStatus


def create_error_response(message_id: int, message: str, error_type: ErrorType) -> ErrorMessageWithId:
    error: ErrorMessageWithId = {
        "type": "error",
        "id": message_id,
        "result": {
            "message": message,
            "error_type": error_type
        }
    }

    return error


def create_set_token_response(message_id: int, token: str) -> SetTokenMessage:
    response: SetTokenMessage = {
        'type': 'set token',
        'id': message_id,
        'result': {
            'token': token,
        }
    }

    return response


def create_set_user_data_response(message_id: int, nickname: str) -> SetUserDataMessage:
    response: SetUserDataMessage = {
        'type': 'set user data',
        'id': message_id,
        'result': {
            'nickname': nickname,
        }
    }

    return response


def create_new_message_response(message_id: int, nickname: str, text: str, time: str, branch: BranchType, ip: str,
                                status: UserStatus) -> NewMessage:
    response: NewMessage = {
        "type": "new message",
        "result": [{
            'id': message_id,
            "nickname": nickname,
            "text": text,
            "time": time,
            'branch': branch,
            'ip': ip,
            'status': status
        }]
    }
    return response


def create_message(message_id: int, nickname: str, text: str, time: str, branch: BranchType, ip: str, status: UserStatus) -> NewMessageResult:
    message: NewMessageResult = {
        'id': message_id,
        "nickname": nickname,
        "text": text,
        "time": time,
        'branch': branch,
        'ip': ip,
        'status': status
    }
    return message


def create_authorize_user_response(message_id: int, result: bool) -> AuthorizeUserMessage:
    response: AuthorizeUserMessage = {
        "type": "authorize user",
        "id": message_id,
        "result": result
    }
    return response


def create_anon_rand_new_participant_response() -> AnonRandNewParticipantMessage:
    response: AnonRandNewParticipantMessage = {
        "type": "new participant",
        "result": {}
    }
    return response


def create_auth_rand_new_participant_response(nickname: str) -> AuthRandNewParticipantMessage:
    response: AuthRandNewParticipantMessage = {
        "type": "new participant",
        "result": {
            "nickname": nickname
        }
    }
    return response


def create_lost_participant_response() -> LostParticipantMessage:
    response: LostParticipantMessage = {
        "type": "lost participant",
        "result": {}
    }
    return response


def create_set_banned_ips_response(ips: List[str], message_id: int) -> SetBannedIpsMessage:
    response: SetBannedIpsMessage = {
        'type': 'set banned ips',
        'id': message_id,
        'result': {
            'ips': ips
        }
    }
    return response


def create_unban_response() -> UnbanMessage:
    response: UnbanMessage = {
        "type": "unbanned",
        "result": {}
    }
    return response


def create_ban_event_response(ip: str) -> BanEventMessage:
    response: BanEventMessage = {
        "type": "ban event",
        "result": {
            "ip": ip
        }
    }
    return response


def create_unban_event_response(ip: str) -> UnbanEventMessage:
    response: UnbanEventMessage = {
        "type": "unban event",
        "result": {
            "ip": ip
        }
    }
    return response


def create_success_response(message_id: int) -> SuccessMessage:
    response: SuccessMessage = {
        'type': 'success',
        'id': message_id,
        'result': {}
    }
    return response


def create_delete_message_event_response(message_id: int, branch: BranchType) -> DeleteMessageEvent:
    response: DeleteMessageEvent = {
        "type": "delete message event",
        "result": {
            "id": message_id,
            "branch": branch
        }
    }
    return response
