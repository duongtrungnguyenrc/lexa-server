import { DatabaseProvider, LearningRecordProvider, TopicProvider, UserProvider } from "@/providers";
import { UserInterestedProviders } from "@/providers/user-interested.provider";
import { Module } from "@nestjs/common";

@Module({
    providers: [
        ...DatabaseProvider,
        ...UserProvider,
        ...UserInterestedProviders,
        ...TopicProvider,
        ...LearningRecordProvider,
    ],
    exports: [
        ...DatabaseProvider,
        ...UserProvider,
        ...UserInterestedProviders,
        ...TopicProvider,
        ...LearningRecordProvider,
    ],
})
export class DatabaseInteractionModule {}
