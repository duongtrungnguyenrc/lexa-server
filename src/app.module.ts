import { Module } from "@nestjs/common";
import { UserModule } from "@/modules";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import {
    Folder,
    FolderSchema,
    LearningRecord,
    LearningRecordSchema,
    Topic,
    TopicSchema,
    User,
    UserSchema,
    Vocabulary,
    VocabularySchema,
} from "@/models/schemas";

@Module({
    imports: [
        UserModule,
        ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
        MongooseModule.forRoot(process.env.CONNECTION_STRING),
        // MongooseModule.forFeature([
        //     { name: Folder.name, schema: FolderSchema },
        //     { name: LearningRecord.name, schema: LearningRecordSchema },
        //     { name: Topic.name, schema: TopicSchema },
        //     { name: User.name, schema: UserSchema },
        //     { name: Vocabulary.name, schema: VocabularySchema },
        // ]),
    ],
    controllers: [],
    providers: [],
    exports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" })],
})
export class AppModule {}
