import { SearchController } from "@/controllers";
import { SearchService } from "@/services";
import { Module } from "@nestjs/common";
import { MongooseInteractionModule } from "@/modules";

@Module({
    imports: [MongooseInteractionModule],
    providers: [SearchService],
    controllers: [SearchController],
    exports: [SearchService],
})
export class SearchModule {}
