import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import BaseSchema from "./base.schema";
import { User, Folder, Vocabulary } from "../schemas";

@Schema()
export class Topic extends BaseSchema {
    @Prop({ default: "" })
    name: string;

    @Prop({ default: "" })
    description: string;

    @Prop({ default: true })
    visibility: boolean;

    @Prop({ default: "" })
    thumbnail: string;

    @Prop({ default: new Date() })
    createdTime: string;

    @Prop({ default: new Date() })
    lastModifyTime: Date;

    @Prop({ default: [] })
    tags: string[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", populate: true })
    author: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Folder", populate: true })
    folder: Folder;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vocabulary" }] })
    vocabularies: Vocabulary[];
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
