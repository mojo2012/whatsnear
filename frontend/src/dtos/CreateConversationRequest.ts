import { Identifiable } from "@/dtos/Identifiable"
import { Message } from "@/dtos/Message"

export interface CreateConversationRequest extends Message {
	poi: Identifiable<string>
}
