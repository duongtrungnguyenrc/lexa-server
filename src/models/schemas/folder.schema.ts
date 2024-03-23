import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import BaseSchema from "./base.schema";
import mongoose from "mongoose";
import { User } from "./user.schema";

@Schema()
export class Folder extends BaseSchema {
    @Prop()
    name: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    author: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null })
    root: Folder;
}

export const FolderSchema = SchemaFactory.createForClass(Folder);
