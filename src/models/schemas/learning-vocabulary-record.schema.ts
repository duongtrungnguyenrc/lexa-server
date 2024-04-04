import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import BaseSchema from "./base.schema";
import mongoose from "mongoose";
import { LearningRecord } from "./learning-record.schema";
import { Vocabulary } from "./vocabulary.schema";

@Schema()
export class LearningVocabularyRecord extends BaseSchema {
    @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: "LearningRecord" } })
    record: LearningRecord;

    @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: "Vocabulary" } })
    vocabulary: Vocabulary;

    @Prop()
    result: boolean;
}

export const LearningVocabularyRecordFactory = SchemaFactory.createForClass(LearningVocabularyRecord);
