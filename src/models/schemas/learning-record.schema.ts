import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { ELearningMethod } from "@/models/enums";
import { User } from "./user.schema";
import { Vocabulary } from "./vocabulary.schema";

@Schema()
export class LearningRecord extends Document {
    @Prop({ default: 0 })
    count: number;

    @Prop()
    time: Date;

    @Prop({ enum: ["METHOD_FLASH_CARD", "METHOD_MULTIPLE_CHOICE", "METHOD_TYPING"], required: true })
    method: ELearningMethod;

    @Prop({ default: 0 })
    result: boolean;

    @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: "User" } })
    user: User;

    @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: "Vocabulary" } })
    vocabulary: Vocabulary;
}

export const LearningRecordSchema = SchemaFactory.createForClass(LearningRecord);
