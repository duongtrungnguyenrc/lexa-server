import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { UserService } from "@/services/user.service";
import { CreateUserDto } from "@/models/dtos";
import { BaseResponseModel } from "@/models";
import { AuthGuard } from "@/guards";
import { HasRole } from "@/decorators";

@Controller("user")
@UseGuards(AuthGuard)
export class UserController {
    constructor(private userService: UserService) {}

    @Post("create")
    async createUser(
        @Body() newUser: CreateUserDto,
    ): Promise<BaseResponseModel> {
        return await this.userService.createUser(newUser);
    }

    @HasRole("ROLE_USER")
    @Get("all")
    async getAllUser(): Promise<BaseResponseModel> {
        return;
    }
}
