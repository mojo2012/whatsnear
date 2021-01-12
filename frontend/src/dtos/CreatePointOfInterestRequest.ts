import { GeoLocation } from "@/dtos/GeoLocation"
import { PointOfServiceType } from "@/enums/PointOfServiceType"

export interface CreatePointOfInterestRequest {
	type: PointOfServiceType
	location: GeoLocation
	title: string
	description: string
	validTo?: Date
}
