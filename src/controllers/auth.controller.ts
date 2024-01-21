import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { LoginDto } from "@/models/dtos";
import { AuthService } from "@/services/auth.service";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("login")
    @HttpCode(200)
    async login(@Body() user: LoginDto) {
        return await this.authService.validateUser(user);
    }
}
