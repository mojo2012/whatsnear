import { Identifiable } from "@/dtos/Identifiable"
import { Message } from "@/dtos/Message"
import { PointOfInterest } from "@/dtos/PointOfInterest"
import { UserData } from "@/dtos/UserData"

export interface Conversation extends Identifiable<string> {
	id: string
	poi: PointOfInterest
	partitipants?: UserData[]
	messages?: Message[]
	createdAt?: Date
}
