import { DistanceUnit } from "@/dtos/DistanceUnit"
import { LatLng } from "@/dtos/LatLng"
import { PointOfServiceType } from "@/enums/PointOfServiceType"

export interface MarkerDto extends google.maps.MarkerOptions {
	position: LatLng
	title?: string
	description?: string
	author?: string
	distanceUnit?: DistanceUnit
	type: PointOfServiceType
}
