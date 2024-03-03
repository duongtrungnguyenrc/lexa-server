import { IsArray, IsNotEmpty } from "class-validator";

export class UpdateInterestedTopicDto {
    @IsArray()
    @IsNotEmpty()
    topics: { id: string }[];
}
