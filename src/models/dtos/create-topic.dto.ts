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
    answers: MultipleChoiceAnswerDto[];
}

export class CreateTopicDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    @IsBoolean()
    visibility: boolean;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    folder: string;

    @ApiProperty()
    @IsArray()
    tags: string[];

    @ApiProperty({ isArray: true, type: VocabularyDto })
    @IsArray()
    vocabularies: VocabularyDto[];
}
