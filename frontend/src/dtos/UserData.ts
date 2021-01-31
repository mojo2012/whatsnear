import { Identifiable } from "@/dtos/Identifiable"

export interface UserData extends Identifiable<string> {
	username: string
	password: string
	firstname: string
	lastname: string
}
