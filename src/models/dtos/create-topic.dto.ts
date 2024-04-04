import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsDate, IsOptional, IsString } from "class-validator";

class MultipleChoiceAnswerDto {
    @ApiProperty()
    @IsString()
    content: string;

    @ApiProperty({ type: Boolean })
    @IsBoolean()
    isTrue: boolean;
}

class VocabularyDto {
    @ApiProperty()
    @IsString()
    word: string;

    @ApiProperty()
    @IsString()
    meaning: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsString()
    imgDescription: string;

    @ApiProperty({ type: MultipleChoiceAnswerDto, isArray: true })
    @IsArray()
    multipleChoiceAnswers: MultipleChoiceAnswerDto[];
}

export class CreateTopicDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    visibility: boolean;

    @ApiProperty()
    description: string;

    @ApiProperty()
    @IsOptional()
    folder?: string;

    @ApiProperty()
    @IsOptional()
    tags?: string[];

    @ApiProperty({ isArray: true, type: VocabularyDto })
    vocabularies: VocabularyDto[];
}
