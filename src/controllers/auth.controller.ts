import { LoginDto } from "@/models/dtos";
import { AuthService } from "@/services/auth.service";
import { Body, Controller, Get, HttpCode, Post, Query, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("login")
    @HttpCode(200)
    async login(@Body() user: LoginDto) {
        return await this.authService.validateUser(user);
    }

    @Get("google-login")
    googleLogin(@Res() res: Response) {
        return res.redirect(this.authService.googleAuth());
    }

    @Get("return")
    async getGoogleLoginReturn(@Query("code") code: string, @Res() res: Response) {
        const url: string = await this.authService.getGoogleUserInfo(code);
        return url && res.redirect(url);
    }
}
