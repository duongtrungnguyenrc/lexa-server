import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import BaseSchema from "./base.schema";
import { User, Folder, Vocabulary } from "../schemas";

@Schema()
export class Topic extends BaseSchema {
    @Prop({ default: "" })
    name: string;

    @Prop({ default: true })
    visibility: boolean;

    @Prop({ default: "" })
    thumbnail: string;

    @Prop({ default: new Date() })
    createdTime: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    author: User;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }] })
    folders: Folder[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vocabulary" }] })
    vocabularies: Vocabulary[];
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
