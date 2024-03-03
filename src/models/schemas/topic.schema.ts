import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Folder } from "./folder.schema";
import { Vocabulary } from "./vocabulary.schema";
import BaseSchema from "./base.schema";

@Schema()
export class Topic extends BaseSchema {
    @Prop()
    id: string;

    @Prop()
    name: string;

    @Prop()
    visibility: boolean;

    @Prop()
    thumbnail: string;

    @Prop()
    createdTime: Date;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }] })
    folders: Folder[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vocabulary" }] })
    vocabularies: Vocabulary[];
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
