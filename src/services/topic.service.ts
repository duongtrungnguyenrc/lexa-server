/**
 * Created by Duong Trung Nguyen on 2024/1/24.
 */

import { MultipleChoiceAnswer, Topic, User, Vocabulary } from "@/models/schemas";
import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserService } from "./user.service";
import { CloudinaryResponse, CreateTopicDto } from "@/models/dtos";
import { CloudinaryService } from "./cloudinary.service";
import { BaseResponseModel } from "@/models";
import { InvalidQueryParamException } from "@/exceptions";

@Injectable()
export class TopicService {
    constructor(
        @InjectModel(Topic.name)
        private readonly topicModel: Model<Topic>,
        @InjectModel(Vocabulary.name)
        private readonly vocabularyModel: Model<Vocabulary>,
        @InjectModel(MultipleChoiceAnswer.name)
        private readonly multipleChoiceAnswerModel: Model<MultipleChoiceAnswer>,
        private readonly userService: UserService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    async findTopicsByName(keyword: string, limit?: number) {
        try {
            if (!keyword) {
                throw new InvalidQueryParamException("invalid keyword value");
            }
            const topics: Topic[] = await this.topicModel
                .find(
                    {
                        name: { $regex: keyword, $options: "i" },
                    },
                    { vocabularies: false },
                )
                .limit(limit ?? 20);

            return new BaseResponseModel("Successfully to find topic by keyword", topics);
        } catch (error) {
            throw new BadRequestException(new BaseResponseModel(error.message));
        }
    }

    async createTopic(
        file: Express.Multer.File,
        payload: CreateTopicDto,
        request: Request,
    ): Promise<BaseResponseModel> {
        const user: User | null = await this.userService.getUserFromRequest(request);

        try {
            const { vocabularies, ...newTopicData } = payload;

            const createdVocabularies: Promise<Vocabulary[]> = Promise.all(
                vocabularies.map(async (vocabulary) => {
                    const { multipleChoiceAnswers, ...newVocabularyData } = vocabulary;

                    const createdMultipleChoiceAnswers: Promise<MultipleChoiceAnswer[]> = Promise.all(
                        vocabularies.map(async (answer) => {
                            return await this.multipleChoiceAnswerModel.create(answer);
                        }),
                    );

                    return await this.vocabularyModel.create({
                        multipleChoiceAnswers: await createdMultipleChoiceAnswers,
                        ...newVocabularyData,
                    });
                }),
            );

            const uploadedImage: Promise<CloudinaryResponse> = file && this.cloudinaryService.uploadFile(file);

            const createdTopic: Topic = await this.topicModel.create({
                author: user,
                thumbnail: (await uploadedImage)?.secure_url,
                vocabularies: await createdVocabularies,
                ...newTopicData,
            });

            return new BaseResponseModel("Successfully to create new topic", createdTopic);
        } catch (error) {
            throw new BaseResponseModel("Failed to create new topic: " + error, null);
        }
    }
}
