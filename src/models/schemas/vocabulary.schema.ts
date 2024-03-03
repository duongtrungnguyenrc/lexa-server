import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Topic } from "./topic.schema";
import { MultipleChoiceAnswer } from "./multiple-choice-answer.schema";
import BaseSchema from "./base.schema";

@Schema()
export class Vocabulary extends BaseSchema {
    @Prop()
    word: string;

    @Prop()
    meaning: string;

    @Prop()
    description: string;

    @Prop()
    imgDescription: string;

    @Prop()
    createdTime: Date;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "MultipleChoiceAnswer" }] })
    answers: MultipleChoiceAnswer;
}

export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);
