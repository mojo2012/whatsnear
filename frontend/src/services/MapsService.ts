import { GeoLocation } from "@/dtos/GeoLocation"
import { MapMarker } from "@/dtos/MapMarker"
import { MapMarkerType } from "@/enums/MapMarkerType"
import { MathUtil } from "@/utils/MathUtil"
import { getDistance } from "geolib"

export class MapsService {
	private static _instance: MapsService

	private cache: MapMarker[] = []

	private constructor() {
		console.log("MapsService instantiated")

		for (let x = 0; x < 100; x++) {
			const randomLat = MathUtil.random(46, 49)
			const randomLon = MathUtil.random(9, 17)

			const location: GeoLocation = {
				latitude: randomLat,
				longitude: randomLon
			}

			this.cache.push(new MapMarker(MapMarkerType.SELLING, location, 0, "Lego max" + x))
		}

		console.log(`${this.cache.length} markers in cache`)
	}

	private calculateDistance(point1: GeoLocation, point2: GeoLocation): number {
		return getDistance(point1, point2)
	}

	public static get instance(): MapsService {
		if (!MapsService._instance) {
			MapsService._instance = new MapsService()
		}

		return MapsService._instance
	}

	public addMarker(marker: MapMarker): void {
		this.cache.push(marker)
	}

	/**
	 * @param maxDistance in meters
	 */
	public getMarkers(location: GeoLocation, maxDistance: number, searchTerm?: string): MapMarker[] {
		let filteredMarkers = this.cache

		if (searchTerm) {
			filteredMarkers = this.cache.filter((marker) => marker.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()))
		}

		// update distance
		this.cache.forEach((marker) => (marker.distance = this.calculateDistance(location, marker.location)))

		// sort by distance
		this.cache.sort((marker1: MapMarker, marker2: MapMarker) => marker1.distance - marker2.distance)

		return filteredMarkers
	}
}
