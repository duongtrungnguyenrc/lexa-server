/**
 * Created by Duong Trung Nguyen on 2024/1/24.
 */

import { Folder, MultipleChoiceAnswer, Topic, User, Vocabulary } from "@/models/schemas";
import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserService } from "./user.service";
import { CreateTopicDto, CreateTopicFolderDto } from "@/models/dtos";
import { CloudinaryService } from "./cloudinary.service";
import { BaseResponseModel } from "@/models";
import { InvalidQueryParamException, ResourceNotFoundException } from "@/exceptions";

@Injectable()
export class TopicService {
    constructor(
        @InjectModel(Topic.name)
        private readonly topicModel: Model<Topic>,
        @InjectModel(Vocabulary.name)
        private readonly vocabularyModel: Model<Vocabulary>,
        @InjectModel(MultipleChoiceAnswer.name)
        private readonly multipleChoiceAnswerModel: Model<MultipleChoiceAnswer>,
        @InjectModel(Folder.name)
        private readonly folderModel: Model<Folder>,
        private readonly userService: UserService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    async createTopicFolder(createTopicFolderDto: CreateTopicFolderDto, request: Request) {
        const user: User = await this.userService.getUserFromRequest(request);

        try {
            const createdFolder = await this.folderModel.create({
                author: user,
                ...createTopicFolderDto,
            });

            return new BaseResponseModel("Successfully to create new Folder", createdFolder);
        } catch (error) {}
    }

    async createTopic(
        file: Express.Multer.File,
        payload: CreateTopicDto,
        request: Request,
    ): Promise<BaseResponseModel> {
        const user: User = await this.userService.getUserFromRequest(request);

        try {
            const { vocabularies, ...newTopicData } = payload;

            const createVocabulariesTask: Promise<Vocabulary[]> = Promise.all(
                vocabularies.map(async (vocabulary) => {
                    const { answers, ...newVocabularyData } = vocabulary;

                    const createdMultipleChoiceAnswers: MultipleChoiceAnswer[] =
                        await this.multipleChoiceAnswerModel.create(answers);

                    return this.vocabularyModel.create({
                        multipleChoiceAnswers: createdMultipleChoiceAnswers,
                        ...newVocabularyData,
                    });
                }),
            );

            const [createdVocabularies, uploadedImage] = await Promise.all([
                createVocabulariesTask,
                file ? this.cloudinaryService.uploadFile(file) : null,
            ]);

            const createdTopic: Topic = await this.topicModel.create({
                author: user,
                thumbnail: uploadedImage?.secure_url,
                vocabularies: createdVocabularies,
                ...newTopicData,
            });

            return new BaseResponseModel("Successfully to create new topic", createdTopic);
        } catch (error) {
            throw new BaseResponseModel("Failed to create new topic: " + error, null);
        }
    }

    async getTopicById(id: string, detail?: boolean) {
        try {
            const query = this.topicModel.findOne({ _id: id })?.lean();

            if (detail) {
                query.populate({
                    path: "vocabularies",
                    populate: {
                        path: "multipleChoiceAnswers",
                    },
                });
            } else {
                query.select("-vocabularies").populate("author");
            }

            const topic = (await query.lean()) as Topic | null;

            if (!topic) throw new HttpException("Topic does not exists", HttpStatus.NO_CONTENT);

            return new BaseResponseModel("Successfully to get topic", topic);
        } catch (error) {
            throw new HttpException("Invalid topic id", HttpStatus.BAD_REQUEST);
        }
    }

    async getRootTopicByCurrentUser(request: Request) {
        const user: User = await this.userService.getUserFromRequest(request);

        try {
            const topicsRequest = this.topicModel
                .find({
                    author: user,
                })
                .select("-vocabularies");

            const foldersRequest = this.folderModel.find({
                author: user,
            });

            const [topics, folders] = await Promise.all([topicsRequest.exec(), foldersRequest.exec()]);

            return new BaseResponseModel("Successfully to get root topics", {
                topics,
                folders,
            });
        } catch (error) {
            throw new BadRequestException(new BaseResponseModel(error.message));
        }
    }

    async getFolderContent(folderId: string, request: Request) {
        try {
            const user: User = await this.userService.getUserFromRequest(request);

            if (!folderId) {
                throw new InvalidQueryParamException("Invalid query params (id)");
            }

            const folder: Folder | null = await this.folderModel.findOne({ _id: folderId, author: user?.id }).lean();

            if (!folder) throw new ResourceNotFoundException("Folder not found");

            const topics = await this.topicModel.find({ folder: folder._id }).lean();
            const folders = await this.folderModel.find({ root: folder._id }).lean();

            return new BaseResponseModel("Successfully to get folder content", { topics, folders });
        } catch (error) {
            throw new BadRequestException(new BaseResponseModel(error.message));
        }
    }
}
