import { Settings } from "@/configuration/Settings"
import { CreatePointOfInterestRequest } from "@/dtos/CreatePointOfInterestRequest"
import { DistanceData } from "@/dtos/DistanceData"
import { DistanceUnit } from "@/dtos/DistanceUnit"
import { GeoLocation } from "@/dtos/GeoLocation"
import { PointOfInterest } from "@/dtos/PointOfInterest"
import { BackendNotReachableException } from "@/exceptions/BackendNotReachableException"
import { getDistance } from "geolib"

export class MapsService {
	private static _instance: MapsService

	private cache: PointOfInterest[] = []

	private constructor() {
		console.log("MapsService instantiated")

		// for (let x = 0; x < 100; x++) {
		// 	const randomLat = MathUtil.random(46, 49)
		// 	const randomLon = MathUtil.random(9, 17)

		// 	const location: GeoLocation = {
		// 		latitude: randomLat,
		// 		longitude: randomLon
		// 	}

		// 	this.cache.push(
		// 		new PointOfInterest(
		// 			PointOfServiceType.SELLING,
		// 			"me",
		// 			location,
		// 			{
		// 				value: 0,
		// 				unit: DistanceUnit.Meters
		// 			},
		// 			"Lego max" + x,
		// 			"description",
		// 			new Date()
		// 		)
		// 	)
		// }
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

	public async addMarker(pointOfInterest: CreatePointOfInterestRequest): Promise<void> {
		const url = Settings.backendUrlV1 + "poi"

		try {
			await fetch(url, { method: "POST", headers: this.getAuthHeader(), body: JSON.stringify(pointOfInterest) })
		} catch (ex) {
			console.error("Could not add marker", ex)
		}
	}

	/**
	 * @param maxDistance in meters
	 */
	public async getMarkers(location: GeoLocation, maxDistance: number, searchTerm?: string): Promise<PointOfInterest[]> {
		const url = new URL(Settings.backendUrlV1 + `poi/${location.latitude},${location.longitude}`)
		url.searchParams.append("maxDistance", maxDistance + "")

		if (searchTerm) {
			url.searchParams.append("textSearch", searchTerm)
		}

		//  type

		try {
			const results: Promise<{ data: PointOfInterest[] }> = await (await fetch(url.toString(), { method: "GET", headers: this.getAuthHeader() })).json()

			return (await results).data
		} catch (ex) {
			throw new BackendNotReachableException("Could not load markers from backend", ex)
		}
	}

	private getAuthHeader(): Headers {
		let headers = new Headers()
		headers.append('Authorization', 'e7849a0b-296c-4c62-a01a-1c19cd6a0275')
		return headers;
	}
}
