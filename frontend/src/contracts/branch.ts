type Branch =
    | "/anon"
    | "/anon/rand"
    | "/auth"
    | "/auth/rand";

export type BranchesStartingWith<T extends Branch> =
    T extends "/anon"
    ? `/anon${"/rand" | ""}`
    : T extends "/auth"
    ? `/auth${"/rand" | ""}`
    : T;

export default Branch;