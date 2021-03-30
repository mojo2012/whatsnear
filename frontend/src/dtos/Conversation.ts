import { Identifiable } from "@/dtos/Identifiable"
import { Message } from "@/dtos/Message"
import { PointOfInterest } from "@/dtos/PointOfInterest"
import { UserData } from "@/dtos/UserData"
import { IsDefined } from "class-validator"

export class Conversation extends Identifiable<string> {
	@IsDefined()
	public poi!: PointOfInterest
	public partitipants?: UserData[]
	public messages?: Message[]
	public createdAt?: Date
}
