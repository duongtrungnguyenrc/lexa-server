import {
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    NotAcceptableException,
} from "@nestjs/common";
import { CreateUserDto } from "@/models/dtos";
import { User } from "@/models/entities";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { BaseResponseModel } from "@/models";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class UserService {
    constructor(
        @Inject("USER_REPOSITORY")
        private readonly userRepository: Repository<User>,
        private readonly mailerService: MailerService,
    ) {}

    async createUser(newUser: CreateUserDto): Promise<BaseResponseModel> {
        const { password, ...user } = newUser;
        const existingUser: User | null = await this.findUserByEmail(
            user.email,
        );

        /* check existing user */

        if (existingUser) {
            throw new HttpException(
                "Email already exists!",
                HttpStatus.BAD_REQUEST,
            );
        }

        try {
            /* password hashing */

            const hashedPassword: string = await bcrypt.hash(password, 10);

            /* save new user */

            const createdUser: User = await this.userRepository.save({
                password: hashedPassword,
                ...user,
            });
            delete createdUser.password;

            /* send confirm email to new user */

            this.mailerService.sendMail({
                to: createdUser.email,
                subject: "WELCOME TO VLEARNING",
                template: "register",
                context: { user: user.fullName }
            });

            /* response to client */

            return new BaseResponseModel(
                201,
                "Successfully to created new user!",
                createdUser,
            );
        } catch (error) {
            throw new NotAcceptableException(error);
        }
    }

    async findUserByEmail(email: string): Promise<User> {
        return await this.userRepository.findOneBy({
            email: email,
        });
    }

    sendEmail() {}
}
