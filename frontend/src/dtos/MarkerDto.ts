import { LatLng } from "@/dtos/LatLng"

export interface MarkerDto {
	position: LatLng
	label?: string
	title?: string
	description?: string
	author?: string
	uid?: string
}
