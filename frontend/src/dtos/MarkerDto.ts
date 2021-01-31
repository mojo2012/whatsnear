import { DistanceUnit } from "@/dtos/DistanceUnit"
import { LatLng } from "@/dtos/LatLng"

export interface MarkerDto extends google.maps.MarkerOptions {
	position: LatLng
	title?: string
	description?: string
	author?: string
	uid?: string
	distanceUnit?: DistanceUnit
}
