from application.contracts.response.authorize_user_message import AuthorizeUserMessage
from application.contracts.response.ban_event_message import BanEventMessage
from application.contracts.response.unban_message import UnbanMessage
from application.contracts.response.delete_message_event import DeleteMessageEvent
from application.contracts.response.error_message import ErrorMessage, ErrorMessageWithId
from application.contracts.response.log_message import LogMessage
from application.contracts.response.anon_rand_new_participant_message import AnonRandNewParticipantMessage
from application.contracts.response.auth_rand_new_participant_message import AuthRandNewParticipantMessage
from application.contracts.response.lost_participant_message import LostParticipantMessage
from application.contracts.response.new_message import NewMessage
from application.contracts.response.new_participant_message import NewParticipantMessage
from application.contracts.response.set_banned_ips_message import SetBannedIpsMessage
from application.contracts.response.set_token_message import SetTokenMessage
from application.contracts.response.set_user_data import SetUserDataMessage
from application.contracts.response.success_message import SuccessMessage
from application.contracts.response.unban_event_message import UnbanEventMessage
from typing import TypeVar

ResponseMessage = TypeVar("ResponseMessage",
                          AuthorizeUserMessage,
                          BanEventMessage,
                          UnbanEventMessage,
                          DeleteMessageEvent,
                          ErrorMessage,
                          ErrorMessageWithId,
                          LogMessage,
                          LostParticipantMessage,
                          NewMessage,
                          NewParticipantMessage,
                          AnonRandNewParticipantMessage,
                          AuthRandNewParticipantMessage,
                          AuthorizeUserMessage,
                          SetBannedIpsMessage,
                          SetTokenMessage,
                          SetUserDataMessage,
                          SuccessMessage,
                          UnbanMessage)
