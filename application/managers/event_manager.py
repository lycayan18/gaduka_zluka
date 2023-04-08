class EventManager:
    def __init__(self) -> None:
        self.subscribers: dict[str, list[str]] = dict()

    def remove_sid_from_all_events(self, sid: str) -> None:
        for event in self.subscribers:
            if sid in self.subscribers[event]:
                self.subscribers[event].remove(sid)

    def subscribe(self, event: str, sid: str) -> None:
        if event not in self.subscribers:
            self.subscribers[event] = list()

        self.subscribers[event].append(sid)

    def unsubscribe(self, event: str, sid: str) -> None:
        if event in self.subscribers:
            self.subscribers[event].remove(sid)

    def get_subscribed_sids_list(self, event: str) -> list[str]:
        return self.subscribers[event]