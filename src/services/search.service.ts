import { InvalidQueryParamException } from "@/exceptions";
import { BaseResponseModel } from "@/models";
import { Topic, User } from "@/models/schemas";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class SearchService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        @InjectModel(Topic.name)
        private readonly topicModel: Model<Topic>,
    ) {}

    async search(request: Request, keyword: string, limit?: number) {
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

            const profiles: User[] = await this.userModel
                .find(
                    {
                        name: { $regex: keyword, $options: "i" },
                    },
                    { vocabularies: false },
                )
                .limit(limit ?? 20);

            return new BaseResponseModel("Successfully to find topic by keyword", {
                topics,
                profiles,
            });
        } catch (error) {
            throw new BadRequestException(new BaseResponseModel(error.message));
        }
    }
}
