import { IsPhoneNumber } from "class-validator";

export class UpdateProfileDto {
    name?: string;

    password?: string;

    @IsPhoneNumber("VN")
    phone?: string;
}
