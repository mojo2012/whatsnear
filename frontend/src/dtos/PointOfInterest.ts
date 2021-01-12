import { DistanceData } from "@/dtos/DistanceData"
import { GeoLocation } from "@/dtos/GeoLocation"
import { PointOfServiceType } from "@/enums/PointOfServiceType"

export class PointOfInterest {
	public constructor(
		public type: PointOfServiceType, //
		public author: string,
		public location: GeoLocation,
		public distance: DistanceData,
		public title: string,
		public description: string,
		public validTo: Date
	) {
		//
	}
}
