import { ApiProperty } from "@nestjs/swagger";

class MultipleChoiceAnswerDto {
    @ApiProperty()
    content: string;

    @ApiProperty({ type: Boolean })
    isTrue: boolean;
}

class VocabularyDto {
    @ApiProperty()
    word: string;

    @ApiProperty()
    meaning: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    imgDescription: string;

    @ApiProperty({ type: Date })
    createdTime: Date;

    @ApiProperty({ type: MultipleChoiceAnswerDto, isArray: true })
    multipleChoiceAnswers: MultipleChoiceAnswerDto[];
}

export class CreateTopicDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    visibility: boolean;

    @ApiProperty({ type: Date })
    createdTime: Date;

    @ApiProperty()
    folderIds: [];

    @ApiProperty({ isArray: true, type: VocabularyDto })
    vocabularies: VocabularyDto[];
}
