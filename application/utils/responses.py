from typing import List, Literal

from application.request_typing.branch import Branch
from application.request_typing.response.error_message import ErrorMessage
from application.request_typing.response.set_token_message import SetTokenMessage
from application.request_typing.response.set_user_data_message import SetUserDataMessage
from application.request_typing.response.new_message import NewMessage, NewMessageResult
from application.request_typing.response.authorize_user_message import AuthorizeUserMessage
from application.request_typing.response.anon_rand_new_participant_message import AnonRandNewParticipantMessage
from application.request_typing.response.auth_rand_new_participant_message import AuthRandNewParticipantMessage
from application.request_typing.response.lost_participant_message import LostParticipantMessage
from application.request_typing.response.set_banned_ips_message import SetBannedIpsMessage
from application.request_typing.response.unban_event_message import UnbanEventMessage
from application.request_typing.response.unban_message import UnbanMessage
from application.request_typing.response.ban_event_message import BanEventMessage
from application.request_typing.response.success_message import SuccessMessage
from application.request_typing.response.delete_message_event import DeleteMessageEvent


def create_error_response(message_id: int, message: str, error_type: str) -> ErrorMessage:
    error = {
        "type": "error",
        "id": message_id,
        "result": {
            "message": message,
            "error_type": error_type
        }
    }
    return error


def create_set_token_response(message_id: int, token: str) -> SetTokenMessage:
    response = {
        'type': 'set token',
        'id': message_id,
        'result': {
            'token': token,
        }
    }

    return response


def create_set_user_data_response(message_id: int, nickname: str) -> SetUserDataMessage:
    response = {
        'type': 'set user data',
        'id': message_id,
        'result': {
            'nickname': nickname,
        }
    }

    return response


def create_new_message_response(message_id: int, nickname: str, text: str, time: str, branch: Branch, ip: str,
                                status: Literal['user'] | Literal['admin']) -> NewMessage:
    response = {
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


def create_message(message_id: int, nickname: str, text: str, time: str, branch: Branch, ip: str, status: Literal['user'] | Literal['admin']) -> NewMessageResult:
    message = {
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
    response = {
        "type": "authorize user",
        "id": message_id,
        "result": result
    }
    return response


def create_anon_rand_new_participant_response() -> AnonRandNewParticipantMessage:
    response = {
        "type": "new participant",
        "result": {}
    }
    return response


def create_auth_rand_new_participant_response(nickname: str) -> AuthRandNewParticipantMessage:
    response = {
        "type": "new participant",
        "result": {
            "nickname": nickname
        }
    }
    return response


def create_lost_participant_response() -> LostParticipantMessage:
    response = {
        "type": "lost participant",
        "result": {}
    }
    return response


def create_set_banned_ips_response(ips: List[str], message_id: int) -> SetBannedIpsMessage:
    response = {
        'type': 'set banned ips',
        'id': message_id,
        'result': {
            'ips': ips
        }
    }
    return response


def create_unban_response() -> UnbanMessage:
    response = {
        "type": "unbanned",
        "result": {}
    }
    return response


def create_ban_event_response(ip: str) -> BanEventMessage:
    response = {
        "type": "ban event",
        "result": {
            "ip": ip
        }
    }
    return response


def create_unban_event_response(ip: str) -> UnbanEventMessage:
    response = {
        "type": "unban event",
        "result": {
            "ip": ip
        }
    }
    return response


def create_success_response() -> SuccessMessage:
    response = {
        'type': 'success',
        'result': {}
    }
    return response


def create_delete_message_event_response(message_id: int, branch: str) -> DeleteMessageEvent:
    response = {
        "type": "delete message event",
        "result": {
            "id": message_id,
            "branch": branch
        }
    }
    return response
