import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { MultipleChoiceAnswer } from "./multiple-choice-answer.schema";
import BaseSchema from "./base.schema";

@Schema()
export class Vocabulary extends BaseSchema {
    @Prop({ default: "" })
    word: string;

    @Prop({ default: "" })
    meaning: string;

    @Prop({ default: "" })
    description: string;

    @Prop({ default: "" })
    imgDescription: string;

    @Prop({ default: new Date() })
    createdTime: Date;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "MultipleChoiceAnswer" }] })
    multipleChoiceAnswers: MultipleChoiceAnswer[];
}

export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);
