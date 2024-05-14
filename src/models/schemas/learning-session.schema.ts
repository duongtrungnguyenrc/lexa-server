import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { ELearningMethod } from "@/models/enums";
import { User } from "./user.schema";
import BaseSchema from "./base.schema";
import { Topic } from "./topic.schema";
import { getCurentDate } from "@/utils";
import { LearningRecord } from "./learning-record.schema";

@Schema()
export class LearningSession extends BaseSchema {
    @Prop({ default: getCurentDate() })
    time: String;

    @Prop({ type: String, enum: Object.values(ELearningMethod) })
    method: ELearningMethod;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Topic" })
    topic: Topic;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "LearningRecord" }], default: [] })
    records: LearningRecord[];
}

export const LearningSessionSchema = SchemaFactory.createForClass(LearningSession);
