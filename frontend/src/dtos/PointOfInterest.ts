import { DistanceData } from "@/dtos/DistanceData"
import { GeoLocation } from "@/dtos/GeoLocation"
import { MapMarkerType } from "@/enums/MapMarkerType"

export class PointOfInterest {
	public constructor(
		public type: MapMarkerType, //
		public location: GeoLocation,
		public distance: DistanceData,
		public description: string,
		public validTo: Date
	) {
		//
	}
}
