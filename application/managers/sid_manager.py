from typing import Union, List

from database.database_manager import DatabaseManager


class SidManager:
    def __init__(self, database: DatabaseManager):
        self.database = database
        self.users = {}

    def get_ip_by_sid(self, sid: str) -> Union[str, None]:
        return self.users.get(sid, None)

    def get_sid_by_ip(self, ip: str):
        for key, value in self.users.items():
            if value == ip:
                return key

    def connect_user(self, sid: str, ip: str):
        self.users[sid] = ip

    def disconnect_user(self, sid: str):
        self.users.pop(sid, None)

    def is_ip_banned(self, ip: str) -> bool:
        return self.database.is_user_banned(ip)

    def get_banned_ips(self) -> List[str]:
        banned_ips = [item.ip for item in self.database.get_banned_ips()]
        return banned_ips

    def ban_user(self, ip: str):
        self.database.add_ip_to_blacklist(ip=ip)

    def unban_user(self, ip: str):
        self.database.remove_from_blacklist(ip=ip)