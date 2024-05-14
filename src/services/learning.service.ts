import { LearningSession, Topic, User, Vocabulary } from "@/models/schemas";
import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserService } from "./user.service";
import { ELearningMethod } from "@/models/enums";
import { LearningRecord } from "@/models/schemas/learning-record.schema";
import { CreateLearningSessionDto, CreateLearningRecordDto } from "@/models/dtos";
import { TopicService } from "./topic.service";
import { stringToELearningMethod } from "@/models/enums/learning-method.enum";
import { BaseResponseModel } from "@/models";

@Injectable()
export class LearningService {
    constructor(
        @InjectModel(LearningSession.name)
        private readonly learningSessionModel: Model<LearningSession>,
        @InjectModel(LearningRecord.name)
        private readonly learningRecordModel: Model<LearningRecord>,
        @InjectModel(Vocabulary.name)
        private readonly vocabularyModel: Model<Vocabulary>,
        private readonly userService: UserService,
        private readonly topicService: TopicService,
    ) {}

    async createLearningSession(request: Request, payload: CreateLearningSessionDto) {
        try {
            const user: User = await this.userService.getUserFromRequest(request);

            const topic: Topic = await this.topicService.getTopicById(payload.topicId);

            if (!topic) throw new BadRequestException("Invalid topic");

            const createdSession: LearningSession = await this.learningSessionModel
                .create({
                    user: user,
                    topic: topic,
                    method: stringToELearningMethod(payload.method) as ELearningMethod,
                })
                .then((createdSession: LearningSession) => {
                    return createdSession.populate(["topic", "user"]);
                })
                .then((populatedSession: LearningSession) => {
                    return populatedSession;
                })
                .catch((error: any) => {
                    throw error;
                });

            return new BaseResponseModel("Successfully to create learning session", createdSession);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async createLearningRecord(request: Request, payload: CreateLearningRecordDto) {
        try {
            const user: User = await this.userService.getUserFromRequest(request);

            const vocabulary: Vocabulary = await this.vocabularyModel
                .findOne({ _id: payload.vocabularyId })
                .select(["-vocabularies", "-multipleChoiceAnswers"]);

            if (!vocabulary) throw new BadRequestException("Invalid vocabulary");

            const createdRecord: LearningRecord = await this.learningRecordModel.create({
                vocabulary: vocabulary,
                answer: payload.answer,
                isTrue: payload.isTrue,
            });

            await this.learningSessionModel.updateOne(
                {
                    _id: payload.sessionId,
                    user: user,
                },
                { $push: { records: createdRecord } },
            );

            return new BaseResponseModel("Create learning record success", createdRecord);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error);
        }
    }
}
