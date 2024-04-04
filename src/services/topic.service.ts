/**
 * Created by Duong Trung Nguyen on 2024/1/24.
 */

import { Folder, MultipleChoiceAnswer, Topic, TopicGroup, User, Vocabulary } from "@/models/schemas";
import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserService } from "./user.service";
import { UpdateFolderDto, CreateTopicDto, CreateTopicFolderDto, UpdateTopicDto } from "@/models/dtos";
import { CloudinaryService } from "./cloudinary.service";
import { BaseResponseModel } from "@/models";
import { InvalidQueryParamException, ResourceNotFoundException } from "@/exceptions";
import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";

@Injectable()
export class TopicService {
    constructor(
        @InjectModel(TopicGroup.name)
        private readonly topicGroupModel: Model<TopicGroup>,
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

    async getAllTopicGroups() {
        try {
            const groups: TopicGroup[] = await this.topicGroupModel.find();

            return new BaseResponseModel("Successfully to get all group", { groups });
        } catch (error) {}
    }

    async getTopicById(id: string, detail?: boolean) {
        try {
            const query = this.topicModel.findOne({ _id: id })?.lean();

            if (detail) {
                query
                    .populate({
                        path: "vocabularies",
                        populate: {
                            path: "multipleChoiceAnswers",
                        },
                    })
                    .populate("author");
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

    async getAllTopicsByUser(request: Request) {
        try {
            const user: User = await this.userService.getUserFromRequest(request);
            if (!user) throw new UnauthorizedException();

            let topics: Topic[] = await this.topicModel
                .find({
                    author: user,
                })
                .populate({
                    path: "vocabularies",
                    populate: {
                        path: "multipleChoiceAnswers",
                    },
                })
                .lean();
            const currentDate = new Date();

            topics.map((topic) => {
                const differenceInMinutesValue = differenceInMinutes(currentDate, topic.createdTime);
                const differenceInHoursValue = differenceInHours(currentDate, topic.createdTime);
                const differenceInDaysValue = differenceInDays(currentDate, topic.createdTime);

                if (differenceInMinutesValue < 1) {
                    topic.createdTime = `${differenceInMinutesValue * 60} seconds ago`;
                } else if (differenceInHoursValue < 1) {
                    topic.createdTime = `${differenceInMinutesValue} minutes ago`;
                } else if (differenceInDaysValue < 1) {
                    topic.createdTime = `${differenceInHoursValue} hours ago`;
                } else {
                    topic.createdTime = `${differenceInDaysValue} days ago`;
                }
                return topic;
            });

            return new BaseResponseModel("Success", topics);
        } catch (error) {
            throw new BadRequestException(new BaseResponseModel(error.message));
        }
    }

    async getRecommendTopics(request: Request, limit?: number) {
        try {
            const user: User = await this.userService.getUserFromRequest(request);
            if (!user) throw new UnauthorizedException();

            const topics = await this.topicModel
                .find({ author: { $ne: user }, visibility: true })
                .select(["-author", "-vocabularies"])
                .limit(limit);

            return new BaseResponseModel("", topics);
        } catch (error) {
            throw new BadRequestException(new BaseResponseModel(error.message));
        }
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
                vocabularies?.map(async (vocabulary) => {
                    const { multipleChoiceAnswers, ...newVocabularyData } = vocabulary;

                    const createdMultipleChoiceAnswers: MultipleChoiceAnswer[] = await Promise.all(
                        multipleChoiceAnswers?.map(async (answer) => {
                            return this.multipleChoiceAnswerModel.create(answer);
                        }),
                    );

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

            return new BaseResponseModel("Successfully to create new topic", await createdTopic.populate("folder"));
        } catch (error) {
            throw new BaseResponseModel("Failed to create new topic: " + error, null);
        }
    }

    async updateTopic(payload: UpdateTopicDto, request: Request) {
        try {
            const { id, folderId, authorId, ...data } = payload;
            const updatingData = {
                lastModifyTime: new Date(),
            };

            const user: User = await this.userService.getUserFromRequest(request);
            if (!user) throw new UnauthorizedException(new BaseResponseModel("Root doesn't exists"));

            if (folderId) {
                updatingData["folder"] = await this.folderModel.findOne({ _id: folderId, author: user }).lean();
            }

            for (const key in data) {
                data[key] && (updatingData[key] = data[key]);
            }
            const updatedFolder: Topic = await this.topicModel
                .findOneAndUpdate({ _id: id, author: user }, updatingData, { new: true })
                .populate("folder");

            return new BaseResponseModel("Successfully to update topic", updatedFolder);
        } catch (error) {
            throw new BadRequestException(new BaseResponseModel(error.message));
        }
    }

    async getFolderById(id: string) {
        try {
            const folder: Folder = await this.folderModel.findOne({ _id: id })?.lean();

            if (!folder) throw new HttpException("Folder does not exists", HttpStatus.NO_CONTENT);

            return new BaseResponseModel("Successfully to get Folder", folder);
        } catch (error) {
            throw new HttpException("Invalid Folder id", HttpStatus.BAD_REQUEST);
        }
    }

    async getFolderContent(request: Request, folderId?: string) {
        try {
            const user: User = await this.userService.getUserFromRequest(request);
            if (!user) throw new UnauthorizedException();

            const folder: Folder = folderId && (await this.folderModel.findOne({ _id: folderId, author: user }).lean());

            if (folderId && !folder) throw new ResourceNotFoundException("Folder not found");

            const topics = await this.topicModel.find({ folder: folder, author: user }).select("-vocabularies").lean();
            const folders = await this.folderModel.find({ root: folder, author: user }).lean();

            return new BaseResponseModel("Successfully to get folder content", { topics, folders });
        } catch (error) {
            throw new BadRequestException(new BaseResponseModel(error.message));
        }
    }

    async createFolder(createTopicFolderDto: CreateTopicFolderDto, request: Request) {
        const user: User = await this.userService.getUserFromRequest(request);

        try {
            const createdFolder = await this.folderModel.create({
                author: user,
                ...createTopicFolderDto,
            });

            return new BaseResponseModel("Successfully to create new Folder", await createdFolder.populate("root"));
        } catch (error) {}
    }

    async updateFolder(payload: UpdateFolderDto, request: Request) {
        try {
            const { folder, target, ...data } = payload;

            const updatingData = {
                lastModifyTime: new Date(),
            };

            const user: User = await this.userService.getUserFromRequest(request);
            if (!user) throw new UnauthorizedException(new BaseResponseModel("Root doesn't exists"));

            const root: Folder | null = target
                ? await this.folderModel.findOne({ _id: target, author: user }).lean()
                : null;

            if (target && !root) throw new BadRequestException(new BaseResponseModel("Root doesn't exists"));
            if (target) updatingData["root"] = root;

            for (const key in data) {
                data[key] && (updatingData[key] = data[key]);
            }
            const updatedFolder: Folder = await this.folderModel
                .findOneAndUpdate({ _id: folder, author: user }, updatingData, { new: true })
                .populate("root");

            return new BaseResponseModel("Successfully to update folder root", updatedFolder);
        } catch (error) {
            throw new BadRequestException(new BaseResponseModel(error.message));
        }
    }
}
