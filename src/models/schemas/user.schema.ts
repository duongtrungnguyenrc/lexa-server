import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { EUserRole } from "../enums";
import { LearningRecord } from "./learning-record.schema";
import BaseSchema from "./base.schema";
import mongoose from "mongoose";
import { Exclude } from "class-transformer";

@Schema()
export class User extends BaseSchema {
    @Prop({ type: String })
    email: string;

    @Prop({ type: String, default: "", select: false })
    @Exclude()
    password: string;

    @Prop({ type: String, default: "" })
    name: string;

    @Prop({ type: String, default: "" })
    phone: string;

    @Prop({ type: String, default: "" })
    avatar: string;

    @Prop({ enum: ["ROLE_ADMIN", "ROLE_USER"], default: "ROLE_USER" })
    role: EUserRole;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], default: [] })
    follows: User[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "LearningRecord" }], default: [] })
    records: LearningRecord[];
}

export const UserSchema = SchemaFactory.createForClass(User);
