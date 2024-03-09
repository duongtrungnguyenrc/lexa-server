export class UserNotFoundException extends Error {
    constructor(msg?: string) {
        super(msg ?? "User not found, please check your email address!");
        Object.setPrototypeOf(this, UserNotFoundException.prototype);
    }
}
