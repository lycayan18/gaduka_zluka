from typing import List


def create_error_response(message_id: int, message: str, error_type: str) -> dict:
    error = {
        "type": "error",
        "id": message_id,
        "result": {
            "message": message,
            "error_type": error_type
        }
    }
    return error


def create_set_token_response(message_id: int, token: str) -> dict:
    response = {
        'type': 'set token',
        'id': message_id,
        'result': {
            'token': token,
        }
    }

    return response


def create_set_user_data_response(message_id: int, nickname: str) -> dict:
    response = {
        'type': 'set user data',
        'id': message_id,
        'result': {
            'nickname': nickname,
        }
    }

    return response


def create_new_message_response(message_id: int, nickname: str, text: str, time: str, branch: str, ip: str,
                                status: str) -> dict:
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


def create_message(message_id: int, nickname: str, text: str, time: str, branch: str, ip: str, status: str) -> dict:
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


def create_authorize_user_response(message_id: int, result: bool) -> dict:
    response = {
        "type": "authorize user",
        "id": message_id,
        "result": result
    }
    return response


def create_anon_rand_new_participant_response() -> dict:
    response = {
        "type": "new participant",
        "result": {}
    }
    return response


def create_auth_rand_new_participant_response(nickname: str) -> dict:
    response = {
        "type": "new participant",
        "result": {
            "nickname": nickname,
        }
    }
    return response


def create_lost_participant_response() -> dict:
    response = {
        "type": "lost participant",
        "parameters": {}
    }
    return response


def create_set_banned_ips_response(ips: List[str], message_id: int) -> dict:
    response = {
        'type': 'set banned ips',
        'id': message_id,
        'result': {
            'ips': ips
        }
    }
    return response


def create_unban_response() -> dict:
    response = {
        "type": "unbanned",
        "result": {}
    }
    return response


def create_ban_event_response(ip: str) -> dict:
    response = {
        "type": "ban event",
        "result": {
            "ip": ip
        }
    }
    return response


def create_unban_event_response(ip: str) -> dict:
    response = {
        "type": "unban event",
        "result": {
            "ip": ip
        }
    }
    return response


def create_success_response(message_id: int) -> dict:
    response = {
        'type': 'success',
        'id': message_id,
        'result': {}
    }
    return response


def create_delete_message_event_response(message_id: int, branch: str) -> dict:
    response = {
        "type": "delete message event",
        "result": {
            "id": message_id,
            "branch": branch
        }
    }
    return response