import { HasRole } from "@/decorators";
import { AuthGuard } from "@/guards";
import { UpdateFolderDto, CreateTopicDto, CreateTopicFolderDto, UpdateTopicDto } from "@/models/dtos";
import { CreateTopicSerializePipe } from "@/pipes/create-topic-serialization.pipe";
import { TopicService } from "@/services";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { Body, Controller, Get, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("topic")
@Controller("topic")
@UseGuards(AuthGuard)
@UseInterceptors(CacheInterceptor)
export class TopicController {
    constructor(private readonly topicService: TopicService) {}

    @Get("/group")
    async getAllTopicGroups() {
        return await this.topicService.getAllTopicGroups();
    }

    @Get("/")
    async getTopic(@Req() request: Request, @Query("id") id: string, @Query("detail") detail?: boolean) {
        if (id) {
            return await this.topicService.getTopicById(id, detail as boolean);
        }
        return this.topicService.getAllTopicsByUser(request);
    }

    @HasRole("*")
    @Post("/")
    @UseInterceptors(FileInterceptor("file"))
    async createTopic(
        @UploadedFile() file: Express.Multer.File,
        @Body(new CreateTopicSerializePipe()) payload: CreateTopicDto,
        @Req() request: Request,
    ) {
        return await this.topicService.createTopic(file, payload, request);
    }

    @HasRole("*")
    @Put("/topic")
    async updateTopic(@Body() payload: UpdateTopicDto, @Req() request: Request) {
        return await this.topicService.updateTopic(payload, request);
    }

    @HasRole("*")
    @Post("/folder")
    async createTopicFolder(@Body() payload: CreateTopicFolderDto, @Req() request: Request) {
        return await this.topicService.createFolder(payload, request);
    }

    @HasRole("*")
    @Get("/topics")
    async getFolderContent(@Req() request: Request, @Query("id") folderId?: string) {
        return await this.topicService.getFolderContent(request, folderId);
    }

    @HasRole("*")
    @Get("/recommend-topics")
    async getRecommendTopic(@Req() request: Request, @Query("limit") limit?: number) {
        return await this.topicService.getRecommendTopics(request, limit);
    }

    @HasRole("*")
    @Put("folder")
    async updateFolder(@Body() payload: UpdateFolderDto, @Req() request: Request) {
        return await this.topicService.updateFolder(payload, request);
    }
}
