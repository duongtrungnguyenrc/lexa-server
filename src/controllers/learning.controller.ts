import { HasRole } from "@/decorators";
import { CreateLearningRecordDto, CreateLearningSessionDto } from "@/models/dtos";
import { LearningService } from "@/services";
import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("learning")
@Controller("learning")
export class LearningController {
    constructor(private readonly learningService: LearningService) {}

    @HasRole("*")
    @Post("session")
    async createLearningSession(@Req() request: Request, @Body() payload: CreateLearningSessionDto) {
        return await this.learningService.createLearningSession(request, payload);
    }

    @HasRole("*")
    @Post("record")
    async createLearningRecord(@Req() request: Request, @Body() payload: CreateLearningRecordDto) {
        return await this.learningService.createLearningRecord(request, payload);
    }

    @HasRole("*")
    @Get("history")
    async getLearningHistory(@Req() request: Request, @Query("topicId") topicId: string) {
        return await this.learningService.getLearningHistory(request, topicId);
    }

    @Get("summary")
    async getLearningSummary() {
        return await this.learningService.getLearningSummary("66093e6f03569adc4e055fef");
    }
}
