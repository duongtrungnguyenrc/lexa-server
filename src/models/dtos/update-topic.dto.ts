import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateTopicDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    visibility?: boolean;

    @ApiProperty()
    @IsArray()
    @IsOptional()
    tags?: string[];

    @ApiProperty()
    @IsString()
    @IsOptional()
    folderId?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    authorId?: string;
}
