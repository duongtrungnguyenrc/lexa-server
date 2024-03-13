import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";

export class UpdateInterestedTopicDto {
    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    topics: { id: string }[];
}
