import { HasRole } from "@/decorators";
import { AuthGuard } from "@/guards";
import { CreateTopicDto, CreateTopicFolderDto } from "@/models/dtos";
import { CreateTopicSerializePipe } from "@/pipes/create-topic-serialization.pipe";
import { TopicService } from "@/services";
import { Body, Controller, Get, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("topic")
@Controller("topic")
@UseGuards(AuthGuard)
export class TopicController {
    constructor(private readonly topicService: TopicService) {}

    @HasRole("ROLE_USER", "ROLE_ADMIN")
    @Post("/create")
    @UseInterceptors(FileInterceptor("file"))
    async createTopic(
        @UploadedFile() file: Express.Multer.File,
        @Body(new CreateTopicSerializePipe()) payload: CreateTopicDto,
        @Req() request: Request,
    ) {
        return await this.topicService.createTopic(file, payload, request);
    }

    @Get("/")
    async getTopic(@Query("id") id: string, @Query("detail") detail?: boolean) {
        return await this.topicService.getTopicById(id, detail);
    }

    @HasRole("*")
    @Post("/folder")
    async createTopicFolder(@Body() payload: CreateTopicFolderDto, @Req() request: Request) {
        return await this.topicService.createTopicFolder(payload, request);
    }

    @HasRole("*")
    @Get("/root-topic")
    async getTopicByCurrentUser(@Req() request: Request) {
        return await this.topicService.getRootTopicByCurrentUser(request);
    }

    @HasRole("*")
    @Get("/folder-content")
    async getFolderContent(@Query("id") folderId: string, @Req() request: Request) {
        return await this.topicService.getFolderContent(folderId, request);
    }
}
