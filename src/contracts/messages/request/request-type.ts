type RequestType =
    | "send"
    | "subscribe"
    | "unsubscribe all"
    | "get token"
    | "create account"
    | "get user data"
    | "authorize user"
    | "unauthorize user"
    | "subscribe admin"
    | "ban user"
    | "get banned ips"
    | "unban";

export default RequestType;