import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import BaseSchema from "./base.schema";
import mongoose from "mongoose";
import { Vocabulary } from "./vocabulary.schema";

@Schema()
export class LearningRecord extends BaseSchema {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Vocabulary" })
    vocabulary: Vocabulary;

    @Prop()
    answer: string;

    @Prop()
    isTrue: boolean;
}

export const LearningRecordSchema = SchemaFactory.createForClass(LearningRecord);
