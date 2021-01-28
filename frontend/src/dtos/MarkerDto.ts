import { LatLng } from "@/dtos/LatLng"

export interface MarkerDto extends google.maps.MarkerOptions {
	position: LatLng
	description?: string
	author?: string
	uid?: string
}
