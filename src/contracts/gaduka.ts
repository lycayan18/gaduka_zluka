import IBaseChatMessage from "./base-chat-message";
import Branch from "./branch";
import IUserData from "./user-data";

export default interface IGaduka {
    isLoggedIn(): boolean;
    getUserData(): IUserData | null;
    setCurrentBranch(branch: Branch | null): void

    send(branch: "/anon", nick: string, text: string): void;
    send(branch: "/auth", text: string): void;

    /**
     * Can be helpful to get chat history beyond 100 last messages
     * @returns array of messages
     */
    getChatHistory(): IBaseChatMessage[];

    login(login: string, password: string): Promise<true | false>;

    createAccount(nickname: string, login: string, password: string): Promise<boolean>;
}