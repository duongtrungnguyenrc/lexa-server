import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import BaseSchema from "./base.schema";

@Schema()
export class MultipleChoiceAnswer extends BaseSchema {
    @Prop()
    content: string;

    @Prop()
    isTrue: boolean;
}

export const MultipleChoiceAnswerSchema = SchemaFactory.createForClass(MultipleChoiceAnswer);
