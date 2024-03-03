import { Topic } from "@/models/entities";
import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class TopicService {
    constructor(
        @Inject("TOPIC_REPOSITORY") topicRepository: Repository<Topic>,
    ) {}

    
}
