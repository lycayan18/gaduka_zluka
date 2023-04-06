from application.request_typing.response.authorize_user_message import AuthorizeUserMessage
from application.request_typing.response.ban_unban_event import BanUnbanUserMessage
from application.request_typing.response.delete_message_event import DeleteMessageEvent
from application.request_typing.response.error_message import ErrorMessage, ErrorMessageWithId
from application.request_typing.response.log_message import LogMessage
from application.request_typing.response.lost_participant_message import LostParticipantMessage
from application.request_typing.response.new_message_event import NewMessageEvent
from application.request_typing.response.new_participant_message import NewParticipantMessage
from application.request_typing.response.set_banned_ips_message import SetBannedIpsMessage
from application.request_typing.response.set_token_message import SetTokenMessage
from application.request_typing.response.set_user_data import SetUserDataMessage
from application.request_typing.response.success_message import SuccessMessage
from application.request_typing.response.unbanned_event_message import UnbannedEventMessage

ResponseMessage = AuthorizeUserMessage \
                | BanUnbanUserMessage \
                | DeleteMessageEvent \
                | ErrorMessage \
                | ErrorMessageWithId \
                | LogMessage \
                | LostParticipantMessage \
                | NewMessageEvent \
                | NewParticipantMessage \
                | SetBannedIpsMessage \
                | SetTokenMessage \
                | SetUserDataMessage \
                | SuccessMessage \
                | UnbannedEventMessage