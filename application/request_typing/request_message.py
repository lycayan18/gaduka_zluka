from application.request_typing.request.authorize_user_message import AuthorizeUserMessage
from application.request_typing.request.create_account_message import CreateAccountMessage
from application.request_typing.request.ban_user_message import BanUserMessage
from application.request_typing.request.get_banned_ips_message import GetBannedIpsMessage
from application.request_typing.request.get_token_message import GetTokenMessage
from application.request_typing.request.delete_message import DeleteMessage
from application.request_typing.request.get_user_data import GetUserDataMessage
from application.request_typing.request.send_chat_message import AnonSendChatMessage, AuthSendChatMessage
from application.request_typing.request.subscribe_admin_message import SubscribeAdminMessage
from application.request_typing.request.subscribe_message import SubscribeMessage
from application.request_typing.request.subscribe_unsubscribe_ban_updates import SubscribeUnsubscribeBanUpdatesMessage
from application.request_typing.request.unauthorize_user_message import UnauthorizeUserMessage
from application.request_typing.request.unban_user_message import UnbanUserMessage
from application.request_typing.request.unsubscribe_all_message import UnsubscribeAllMessage
from typing import TypeVar

RequestMessage = TypeVar("RequestMessage", AuthorizeUserMessage,
                         CreateAccountMessage,
                         BanUserMessage,
                         GetBannedIpsMessage,
                         GetTokenMessage,
                         DeleteMessage,
                         GetUserDataMessage,
                         AnonSendChatMessage,
                         AuthSendChatMessage,
                         SubscribeAdminMessage,
                         SubscribeMessage,
                         SubscribeUnsubscribeBanUpdatesMessage,
                         UnauthorizeUserMessage,
                         UnbanUserMessage,
                         UnsubscribeAllMessage)
