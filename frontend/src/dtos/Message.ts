export interface Message {
	id?: string
	conversation?: string
	sender?: string
	text?: string
	visibility?: "PRIVATE" | "PUBLIC"
	createdAt?: Date
}
