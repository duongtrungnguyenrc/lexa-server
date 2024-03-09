import {
    Topic,
    TopicSchema,
    User,
    UserSchema,
    Vocabulary,
    VocabularySchema,
    MultipleChoiceAnswer,
    MultipleChoiceAnswerSchema,
} from "@/models/schemas";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Topic.name, schema: TopicSchema },
            { name: User.name, schema: UserSchema },
            { name: Vocabulary.name, schema: VocabularySchema },
            { name: MultipleChoiceAnswer.name, schema: MultipleChoiceAnswerSchema },
        ]),
    ],
    exports: [
        MongooseModule.forFeature([
            { name: Topic.name, schema: TopicSchema },
            { name: User.name, schema: UserSchema },
            { name: Vocabulary.name, schema: VocabularySchema },
            { name: MultipleChoiceAnswer.name, schema: MultipleChoiceAnswerSchema },
        ]),
    ],
})
export class MongooseInteractionModule {}
