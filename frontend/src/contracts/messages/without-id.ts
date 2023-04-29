import IBaseMessage from "./base-message";

type WithoutId<T extends IBaseMessage> = Omit<T, "id">;

export default WithoutId;