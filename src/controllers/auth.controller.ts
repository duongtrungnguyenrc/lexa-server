import { HasRole } from "@/decorators";
import { AuthGuard } from "@/guards";
import { LoginDto } from "@/models/dtos";
import { AuthService } from "@/services/auth.service";
import { Body, Controller, Get, HttpCode, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";

@ApiTags("auth")
@Controller("auth")
@UseGuards(AuthGuard)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("auth")
    @HttpCode(200)
    async login(@Body() user: LoginDto) {
        return await this.authService.validate(user);
    }

    @Post("token-auth")
    @HttpCode(200)
    async tokenLogin(@Req() request: Request, @Body() payload: { refreshToken: string }) {
        return await this.authService.tokenValidate(request, payload.refreshToken);
    }

    // @Post("extend-session")
    // async extendAuthSession(@Req() request: Request, @Body() payload: { refreshToken: string }) {
    //     return await this.authService.extendToken(request, payload.refreshToken);
    // }

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
