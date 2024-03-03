import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import BaseSchema from "./base.schema";

@Schema()
export class Folder extends BaseSchema {
    @Prop()
    name: string;
}

export const FolderSchema = SchemaFactory.createForClass(Folder);
