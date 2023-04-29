from application.contracts.request.authorize_user_message import AuthorizeUserMessage
from application.contracts.request.create_account_message import CreateAccountMessage
from application.contracts.request.ban_user_message import BanUserMessage
from application.contracts.request.get_banned_ips_message import GetBannedIpsMessage
from application.contracts.request.get_token_message import GetTokenMessage
from application.contracts.request.delete_message import DeleteMessage
from application.contracts.request.get_user_data import GetUserDataMessage
from application.contracts.request.send_chat_message import AnonSendChatMessage, AuthSendChatMessage
from application.contracts.request.subscribe_admin_message import SubscribeAdminMessage
from application.contracts.request.subscribe_message import SubscribeMessage
from application.contracts.request.subscribe_unsubscribe_ban_updates import SubscribeUnsubscribeBanUpdatesMessage
from application.contracts.request.unauthorize_user_message import UnauthorizeUserMessage
from application.contracts.request.unban_user_message import UnbanUserMessage
from application.contracts.request.unsubscribe_all_message import UnsubscribeAllMessage
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
