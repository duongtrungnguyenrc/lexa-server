import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>(
            "roles",
            context.getHandler(),
        );
        if (!roles) {
            return true;
        }

        const request: Request = context.switchToHttp().getRequest();
        const token: string = request.headers["authorization"];

        if (!token) {
            return false;
        }

        try {
            const decodedToken = this.jwtService.verify(token.split(" ")[1]);

            return roles.includes(decodedToken.role);
        } catch (error) {
            return false;
        }
    }
}
