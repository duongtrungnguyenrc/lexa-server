import { LearningController } from "@/controllers";
import { LearningService } from "@/services";
import { Module } from "@nestjs/common";
import { UserModule } from "./user.module";
import { MongooseInteractionModule } from "./mongoose-interaction.module";
import { TopicModule } from "./topic.module";

@Module({
    imports: [UserModule, MongooseInteractionModule, TopicModule],
    controllers: [LearningController],
    providers: [LearningService],
})
export class LearningModule {}
