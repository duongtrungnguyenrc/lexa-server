import { HttpException, HttpStatus } from "@nestjs/common";

export class RequestHandlerUtils {
    static getAuthToken(request: Request): string {
        const authToken: string =
            request.headers["authorization"]?.split(" ")[1];
        if (!authToken)
            throw new HttpException(
                "Invalid authorization token!",
                HttpStatus.FORBIDDEN,
            );
        return authToken;
    }
}
