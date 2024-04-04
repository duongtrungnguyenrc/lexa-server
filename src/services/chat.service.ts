import { ChatRoom, Message, User } from "@/models/schemas";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserService } from "./user.service";
import { BaseResponseModel } from "@/models";
import { CreateMessageDto, CreateTopicDto } from "@/models/dtos";

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(ChatRoom.name)
        private readonly chatRoomModel: Model<ChatRoom>,
        @InjectModel(Message.name)
        private readonly MessageModel: Model<Message>,
        private readonly userService: UserService,
    ) {}

    async getRoom(id: string): Promise<ChatRoom> {
        try {
            return await this.chatRoomModel.findOne({ _id: id }).populate("messages").exec();
        } catch (error) {
            throw error;
        }
    }

    async getUserRooms(request: Request) {
        try {
            const user: User = await this.userService.getUserFromRequest(request);
            const rooms = await this.chatRoomModel.find({ users: user }).populate("messages");

            return new BaseResponseModel("Successfully to get all room by user", rooms);
        } catch (error) {
            return new BadRequestException(error.message);
        }
    }

    async createChatRoom(request: Request, receiverId: string) {
        try {
            const user: User = await this.userService.getUserFromRequest(request);
            const receiver: User = await this.userService.getUserbyId(receiverId);

            const existingRoom = await this.chatRoomModel
                .findOne({ users: [user, receiver] })
                .populate("users")
                .exec();

            if (existingRoom) return new BaseResponseModel("Room already exists", existingRoom);

            const createdRoom: ChatRoom = await (
                await this.chatRoomModel.create({
                    users: [user, receiver],
                })
            ).populate("users");

            return new BaseResponseModel("Successfully to create new room", createdRoom);
        } catch (error) {
            return new BadRequestException(error.message);
        }
    }

    async createMessage(payload: CreateMessageDto, room: ChatRoom) {
        try {
            const user: User = await this.userService.getUserbyId(payload.userId);
            const createdMessage = await this.MessageModel.create({
                sender: user,
                message: payload.message,
            });

            room.messages.push(createdMessage);
            await room.save();

            return createdMessage;
        } catch (error) {
            throw error;
        }
    }
}
