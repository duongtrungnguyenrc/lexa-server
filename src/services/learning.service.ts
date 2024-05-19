import { LearningSession, Topic, User, Vocabulary } from "@/models/schemas";
import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UserService } from "./user.service";
import { ELearningMethod } from "@/models/enums";
import { LearningRecord } from "@/models/schemas/learning-record.schema";
import { CreateLearningSessionDto, CreateLearningRecordDto } from "@/models/dtos";
import { TopicService } from "./topic.service";
import { stringToELearningMethod } from "@/models/enums/learning-method.enum";
import { BaseResponseModel } from "@/models";
import { getCurentDate } from "@/utils";

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
                    time: getCurentDate(),
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

            await this.userService.update(
                { $or: [{ id: user._id }, { _id: user._id }] },
                { $push: { learningSessions: createdSession } },
            );

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

    async getLearningHistory(request: Request, topicId: string) {
        try {
            const user: User = await this.userService.getUserFromRequest(request);
            const topic: Topic = await this.topicService.getTopicById(topicId);

            if (!topic) throw new BadRequestException("Invalid topic!");

            const learningHistory: LearningSession[] = await this.learningSessionModel
                .find({
                    $or: [{ id: user.learningSessions }, { _id: user.learningSessions }],
                    topic: topic,
                })
                .populate("records")
                .lean();

            return new BaseResponseModel("Get learning history success", learningHistory);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error);
        }
    }

    async getLearningSummary(topicId: string) {
        try {
            const topic = new Types.ObjectId(topicId);

            const sessions = await this.learningSessionModel.aggregate([
                { $match: { topic: topic } },
                { $unwind: "$records" },
                {
                    $lookup: {
                        from: "learningrecords",
                        localField: "records",
                        foreignField: "_id",
                        as: "recordDetails",
                    },
                },
                { $unwind: { path: "$recordDetails", preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: "$_id",
                        session: { $first: "$$ROOT" },
                        correctAnswers: {
                            $sum: {
                                $cond: ["$recordDetails.isTrue", 1, 0],
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "session.user",
                        foreignField: "_id",
                        as: "userDetails",
                    },
                },
                { $unwind: "$userDetails" },
                {
                    $project: {
                        "session.records": 0,
                        "session.user": 0,
                        "userDetails.password": 0,
                        "userDetails.learningSessions": 0,
                        "userDetails.follows": 0,
                        recordDetails: 0,
                    },
                },
                { $sort: { correctAnswers: -1 } },
            ]);

            return new BaseResponseModel(
                "Get learning summary success",
                sessions.map((session) => ({
                    ...session.session,
                    user: session.userDetails,
                    correctAnswers: session.correctAnswers,
                })),
            );
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }
}
