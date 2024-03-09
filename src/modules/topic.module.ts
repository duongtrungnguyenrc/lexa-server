import { TopicController } from "@/controllers";
import {
    MultipleChoiceAnswer,
    MultipleChoiceAnswerSchema,
    Topic,
    TopicSchema,
    User,
    UserSchema,
    Vocabulary,
    VocabularySchema,
} from "@/models/schemas";
import { TopicService } from "@/services";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./user.module";

@Module({
    imports: [
        UserModule,
        MongooseModule.forFeature([
            { name: Topic.name, schema: TopicSchema },
            { name: User.name, schema: UserSchema },
            { name: Vocabulary.name, schema: VocabularySchema },
            { name: MultipleChoiceAnswer.name, schema: MultipleChoiceAnswerSchema },
        ]),
    ],
    controllers: [TopicController],
    providers: [TopicService],
    exports: [TopicService],
})
export class TopicModule {}
