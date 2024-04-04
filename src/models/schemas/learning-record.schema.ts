import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { ELearningMethod } from "@/models/enums";
import { User } from "./user.schema";
import BaseSchema from "./base.schema";
import { Topic } from "./topic.schema";

@Schema()
export class LearningRecord extends BaseSchema {
    @Prop()
    time: Date;

    @Prop({ enum: ["METHOD_FLASH_CARD", "METHOD_MULTIPLE_CHOICE", "METHOD_TYPING"], required: true })
    method: ELearningMethod;

    @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: "User" } })
    user: User;

    @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: "topic" } })
    topic: Topic;
}

export const LearningRecordSchema = SchemaFactory.createForClass(LearningRecord);
