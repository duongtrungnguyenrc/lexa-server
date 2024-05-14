import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class CreateLearningRecordDto {
    @ApiProperty()
    @IsString()
    sessionId: string;

    @ApiProperty()
    @IsString()
    vocabularyId: string;

    @ApiProperty()
    @IsBoolean()
    isTrue: boolean;

    @ApiProperty()
    @IsString()
    answer: string;
}
