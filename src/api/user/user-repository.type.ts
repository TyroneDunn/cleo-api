export interface UserRepository {
    registerUser(username: string, password: string): Promise<void>;
    userExists(username: string): Promise<Boolean>;
}