import { Controller } from "@nestjs/common";
import { ChatService } from "./Chat.Service";

@Controller('chat')
export class ChatController{
    constructor(private readonly ChatService) { }
    
}