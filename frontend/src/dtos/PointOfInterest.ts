import { DistanceData } from "@/dtos/DistanceData"
import { GeoLocation } from "@/dtos/GeoLocation"
import { Identifiable } from "@/dtos/Identifiable"
import { PointOfServiceType } from "@/enums/PointOfServiceType"

export class PointOfInterest implements Identifiable<string> {
	public constructor(
		public id: string, //
		public type: PointOfServiceType,
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
