import { ChatService } from "@/services";
import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("chat")
@Controller("chat")
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get("rooms")
    async getRoomsByUser(@Req() request: Request) {
        return this.chatService.getUserRooms(request);
    }

    @Post("room")
    async createChatRoom(@Req() request: Request, @Body() body: { receiverId: string }) {
        return this.chatService.createChatRoom(request, body.receiverId);
    }
}
