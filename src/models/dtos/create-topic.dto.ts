export class CreateTopicDto {
    name: string;
    visibility: boolean;
    createdTime: Date;
    folderIds: [];
    vocabularies: Vocabulary[];
}

class Vocabulary {
    word: string;
    meaning: string;
    description: string;
    imgDescription: string;
    createdTime: Date;
    multipleChoiceAnswers: MultipleChoiceAnswer[];
}

class MultipleChoiceAnswer {
    content: string;
    isTrue: boolean;
}
