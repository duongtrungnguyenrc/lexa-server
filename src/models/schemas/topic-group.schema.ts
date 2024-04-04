import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import BaseSchema from "./base.schema";
@Schema()
export class TopicGroup extends BaseSchema {
    @Prop({ default: "" })
    name: string;
}
export const TopicGroupSchema = SchemaFactory.createForClass(TopicGroup);
