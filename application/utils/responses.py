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


def create_new_message_response(nickname: str, text: str, time: str) -> dict:
    response = {
        "type": "new message",
        "result": [{
            "nickname": nickname,
            "text": text,
            "time": time
        }]
    }
    return response


def create_message(nickname: str, text: str, time: str) -> dict:
    message = {
        "nickname": nickname,
        "text": text,
        "time": time
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
