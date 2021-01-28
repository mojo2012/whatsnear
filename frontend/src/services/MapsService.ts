import { Settings } from "@/configuration/Settings"
import { CreatePointOfInterestRequest } from "@/dtos/CreatePointOfInterestRequest"
import { DistanceData } from "@/dtos/DistanceData"
import { DistanceUnit } from "@/dtos/DistanceUnit"
import { GeoLocation } from "@/dtos/GeoLocation"
import { Payload } from "@/dtos/Payload"
import { PointOfInterest } from "@/dtos/PointOfInterest"
import { BackendNotReachableException } from "@/exceptions/BackendNotReachableException"
import { AuthService } from "@/services/AuthService"
import { RequestUtil } from "@/utils/RequestUtil"
import { getDistance } from "geolib"

export class MapsService {
	private static _instance: MapsService

	private cache: PointOfInterest[] = []
	public authService = AuthService.instance

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
			const headers = await this.createAuthenticationHeader()
			const options = {
				method: "POST",
				headers: headers,
				body: JSON.stringify(pointOfInterest)
			}
			await RequestUtil.fetch(url, options)
		} catch (ex) {
			console.error("Could not add marker", ex)
			// throw new BackendNotReachableException("Could not load markers from backend", ex)
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

		try {
			const conf = {
				method: "GET",
				headers: await this.createAuthenticationHeader()
			}
			const results: Promise<Payload<PointOfInterest[]>> = await (await RequestUtil.fetch(url.toString(), conf)).json()

			return (await results).data
		} catch (ex) {
			throw new BackendNotReachableException("Could not load markers from backend", ex)
		}
	}

	private createAuthenticationHeader(): Headers {
		const authentication = this.authService.authentication
		const headers = new Headers()

		if (authentication?.token) {
			headers.append("Authorization", authentication.token)
		}

		return headers
	}
}
