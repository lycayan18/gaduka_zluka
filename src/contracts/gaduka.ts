import IBaseChatMessage from "./base-chat-message";
import Branch from "./branch";
import IUserData from "./user-data";

export default interface IGaduka {
    isLoggedIn(): boolean;
    getUserData(): IUserData | null;
    setCurrentBranch(branch: Branch | "admin" | null): void
    getCurrentBranch(): Branch | "admin" | null;

    deleteMessage(id: number, branch: Branch): void;

    getBannedIps(): string[];

    sendBanRequest(ip: string): void;
    sendUnbanRequest(ip: string): void;

    send(branch: "/anon" | "/anon/rand", nick: string, text: string): void;
    send(branch: "/auth" | "/auth/rand", text: string): void;

    /**
     * Can be helpful to get chat history beyond 100 last messages
     * @returns array of messages
     */
    getChatHistory(branch: Branch): IBaseChatMessage[];

    login(login: string, password: string): Promise<true | false>;

    unauthorize(): void;

    createAccount(nickname: string, login: string, password: string): Promise<boolean>;
}