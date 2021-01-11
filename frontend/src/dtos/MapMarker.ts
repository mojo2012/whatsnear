import { GeoLocation } from "@/dtos/GeoLocation"
import { MapMarkerType } from "@/enums/MapMarkerType"

export class MapMarker {
	public constructor(
		public type: MapMarkerType, //
		public location: GeoLocation,
		public distance: number,
		public description: string
	) {
		//
	}
}
