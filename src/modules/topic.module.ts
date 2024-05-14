import { TopicController } from "@/controllers";
import { TopicService } from "@/services";
import { Module } from "@nestjs/common";
import { UserModule } from "./user.module";
import { MongooseInteractionModule } from "./mongoose-interaction.module";

@Module({
    imports: [UserModule, MongooseInteractionModule],
    controllers: [TopicController],
    providers: [TopicService],
    exports: [TopicService],
})
export class TopicModule {}
