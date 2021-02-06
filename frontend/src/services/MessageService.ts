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
			const response = await this.requestService.get(url)
			const body: Promise<Payload<Conversation[]>> = await response.json()
			const data = (await body).data

			return data
		} catch (ex) {
			throw new BackendNotReachableException("Could not load conversations from backend", ex)
		}
	}

	public async getMessages(conversationId: string): Promise<Message[]> {
		const url = `${Settings.backendUrlV1}/conversations/${conversationId}`

		try {
			const response = await this.requestService.get(url)
			const body: Promise<Payload<Message[]>> = await response.json()

			return (await body).data
		} catch (ex) {
			throw new BackendNotReachableException(`Could not load messages for conversation ${conversationId}`, ex)
		}
	}

	public async sendMessage(poiId: string): Promise<void> {
		const url = `${Settings.backendUrlV1}/conversations/messages/send${poiId}`

		try {
			const response = await this.requestService.post(url)
			const body: Promise<Payload<void>> = await response.json()
			const data = (await body).data

			if (!response.ok) {
				throw new BackendNotReachableException(`Got bad response while sending message to poi ${poiId}`)
			}
		} catch (ex) {
			throw new BackendNotReachableException(`Could not send messages for poi ${poiId}`, ex)
		}
	}
}
