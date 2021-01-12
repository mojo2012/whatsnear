import { DistanceData } from "@/dtos/DistanceData"
import { DistanceUnit } from "@/dtos/DistanceUnit"
import { GeoLocation } from "@/dtos/GeoLocation"
import { PointOfInterest } from "@/dtos/PointOfInterest"
import { MapMarkerType } from "@/enums/MapMarkerType"
import { MathUtil } from "@/utils/MathUtil"
import { getDistance } from "geolib"

export class MapsService {
	private static _instance: MapsService

	private cache: PointOfInterest[] = []

	private constructor() {
		console.log("MapsService instantiated")

		for (let x = 0; x < 100; x++) {
			const randomLat = MathUtil.random(46, 49)
			const randomLon = MathUtil.random(9, 17)

			const location: GeoLocation = {
				latitude: randomLat,
				longitude: randomLon
			}

			this.cache.push(
				new PointOfInterest(
					MapMarkerType.SELLING,
					location,
					{
						value: 0,
						unit: DistanceUnit.Meters
					},
					"Lego max" + x,
					new Date()
				)
			)
		}

		console.log(`${this.cache.length} markers in cache`)
	}

	private calculateDistance(point1: GeoLocation, point2: GeoLocation): DistanceData {
		const distanceValueInMeters = getDistance(point1, point2)

		const distance: DistanceData = {
			unit: DistanceUnit.Meters,
			value: distanceValueInMeters
		}

		return distance
	}

	public static get instance(): MapsService {
		if (!MapsService._instance) {
			MapsService._instance = new MapsService()
		}

		return MapsService._instance
	}

	public addMarker(marker: PointOfInterest): void {
		this.cache.push(marker)
	}

	/**
	 * @param maxDistance in meters
	 */
	public getMarkers(location: GeoLocation, maxDistance: number, searchTerm?: string): PointOfInterest[] {
		let filteredMarkers = this.cache

		if (searchTerm) {
			filteredMarkers = this.cache.filter((marker) => marker.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()))
		}

		// update distance
		this.cache.forEach((marker) => (marker.distance = this.calculateDistance(location, marker.location)))

		// sort by distance
		this.cache.sort((marker1: PointOfInterest, marker2: PointOfInterest) => marker1.distance.value - marker2.distance.value)

		return filteredMarkers
	}
}
