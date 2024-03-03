import { Body, Controller, Get, HttpCode, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "@/services/user.service";
import { CreateUserDto, LoginDto, UpdateProfileDto } from "@/models/dtos";
import { BaseResponseModel } from "@/models";
import { AuthGuard } from "@/guards";
import { HasRole } from "@/decorators";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("user")
@UseGuards(AuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post("login")
    @HttpCode(200)
    async login(@Body() user: LoginDto) {
        return await this.userService.validateUser(user);
    }

    @Post("create")
    async createUser(@Body() newUser: CreateUserDto): Promise<BaseResponseModel> {
        return await this.userService.createUser(newUser);
    }

    @HasRole("ROLE_USER")
    @Get("all")
    async getAllUser(): Promise<BaseResponseModel> {
        return;
    }

    @HasRole("ROLE_USER", "ROLE_ADMIN")
    @Post("update-avatar")
    @UseInterceptors(FileInterceptor("file"))
    async updateAvatar(@UploadedFile() file: Express.Multer.File, @Req() request: Request) {
        return await this.userService.updateAvatar(file, request);
    }

    @HasRole("ROLE_USER", "ROLE_ADMIN")
    @Post("update-pofile")
    async updateProfile(@Body() newProfile: UpdateProfileDto, @Req() request: Request) {
        return await this.userService.updateProfile(newProfile, request);
    }
}
