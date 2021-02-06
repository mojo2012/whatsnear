import { Message } from "@/dtos/Message"

export interface SendMessageRequest extends Message {
	poi: string
}
