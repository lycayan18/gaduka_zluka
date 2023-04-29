import IBaseMessage from "./base-message";
import IBaseMessageWithId from "./base-message-with-id";
import WithoutId from "./without-id";

type WithId<T extends WithoutId<IBaseMessage>> = T & IBaseMessageWithId;

export default WithId;