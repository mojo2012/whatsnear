import { GeoLocation } from "@/dtos/GeoLocation"

export interface ExtendedGeoLocation extends GeoLocation {
	readonly accuracy: number
	readonly altitude: number | null
	readonly altitudeAccuracy: number | null
	readonly heading: number | null
	readonly speed: number | null
}
