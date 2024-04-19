import { HttpException, HttpStatus } from "@nestjs/common";

export class RequestHandlerUtils {
    static getAuthToken(request: Request): string {
        const authorizationHeader = request.headers["authorization"];
        if (!authorizationHeader) throw new HttpException("Invalid authorization token!", HttpStatus.UNAUTHORIZED);

        const [tokenType, authToken] = request.headers["authorization"]?.split(" ");
        if (tokenType !== "Bearer") throw new HttpException("Invalid token type!", HttpStatus.UNAUTHORIZED);
        if (!authToken) throw new HttpException("Invalid authorization token!", HttpStatus.UNAUTHORIZED);
        return authToken;
    }
}
