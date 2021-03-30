import { Identifiable } from "@/dtos/Identifiable"
import { Optional } from "@/types/Optional"

export interface UserData extends Identifiable<Optional<string>> {
	username: string
	password: string
	firstname: string
	lastname: string
	maxDistance?: number
	showOnlyWithinRadius?: boolean
}
