import {IsEmail, IsNotEmpty, IsPhoneNumber} from "class-validator";

export default class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    fullName: string;

    @IsPhoneNumber("VN")
    @IsNotEmpty()
    phone: string;
}