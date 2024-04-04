import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateFolderDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    folder: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    target?: string;
}