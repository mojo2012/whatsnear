import { Settings } from "@/configuration/Settings"
import { Conversation } from "@/dtos/Conversation"
import { Message } from "@/dtos/Message"
import { Payload } from "@/dtos/Payload"
import { BackendNotReachableException } from "@/exceptions/BackendNotReachableException"
import { RequestService } from "@/services/RequestService"

export class MessageService {
	private static _instance: MessageService

	private requestService = RequestService.instance

	private constructor() {
		//
	}

	public static get instance(): MessageService {
		if (!MessageService._instance) {
			MessageService._instance = new MessageService()
		}

		return MessageService._instance
	}

	public async getConversations(): Promise<Conversation[]> {
		const url = `${Settings.backendUrlV1}/conversations`

		try {
			const response = await this.requestService.get(url.toString())
			const body: Promise<Payload<Conversation[]>> = await response.json()

			return (await body).data
		} catch (ex) {
			throw new BackendNotReachableException("Could not load conversations from backend", ex)
		}
	}

	public async getMessages(conversationId: string): Promise<Message[]> {
		const url = `${Settings.backendUrlV1}/conversations/${conversationId}`

		try {
			const response = await this.requestService.get(url.toString())
			const body: Promise<Payload<Message[]>> = await response.json()

			return (await body).data
		} catch (ex) {
			throw new BackendNotReachableException(`Could not load messages for conversation ${conversationId}`, ex)
		}
	}
}
