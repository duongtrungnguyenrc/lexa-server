import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import BaseSchema from "./base.schema";
import { Topic } from "./topic.schema";
import { User } from "./user.schema";
import mongoose from "mongoose";
@Schema()
export class Post extends BaseSchema {
    @Prop({ default: "" })
    caption: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", populate: true })
    author: User;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: "Topic" })
    topicReference: Topic;

}
export const PostSchema = SchemaFactory.createForClass(Post);
