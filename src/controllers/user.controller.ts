import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Put,
    Query,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { UserService } from "@/services/user.service";
import { CreateUserDto, ResetPasswordDto, UpdateProfileDto } from "@/models/dtos";
import { BaseResponseModel } from "@/models";
import { AuthGuard } from "@/guards";
import { HasRole } from "@/decorators";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("user")
@Controller("user")
@UseGuards(AuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post("sign-up")
    async signUp(@Body() newUser: CreateUserDto): Promise<BaseResponseModel> {
        return await this.userService.signUp(newUser);
    }

    @Get("find-accounts")
    async findAccounts(@Query("key") key: string) {
        return await this.userService.findAccounts(key);
    }

    @HasRole("ROLE_USER")
    @Get("all")
    async getAllUser(): Promise<BaseResponseModel> {
        return;
    }

    @HasRole("*")
    @Put("avatar")
    @UseInterceptors(FileInterceptor("file"))
    async updateAvatar(@UploadedFile() file: Express.Multer.File, @Req() request: Request) {
        return await this.userService.updateAvatar(file, request);
    }

    @HasRole("*")
    @Put("profile")
    async updateProfile(@Body() newProfile: UpdateProfileDto, @Req() request: Request) {
        return await this.userService.updateProfile(newProfile, request);
    }

    @HasRole("*")
    @Get("profile")
    async getAuthenticatedProfile(@Req() request: Request, @Query("id") id?: string) {
        return await this.userService.getUserProfile(request, id);
    }

    @Get("top-author")
    async getTopAuthors(@Req() request: Request, @Query("limit") limit?: number) {
        return await this.userService.getTopAuthors(request, limit);
    }

    @Delete("forgot-password")
    async destroyForgotPasswordTransaction(@Query("transactionId") transactionId: string) {
        return await this.userService.destroyResetPasswordTransaction(transactionId);
    }

    @Get("forgot-password")
    async forgotPassword(@Query("userId") userId: string) {
        return await this.userService.createResetPasswordTransaction(userId);
    }

    @Post("reset-password")
    async resetPassword(@Body() payload: ResetPasswordDto) {
        return await this.userService.resetPassword(payload);
    }
}
