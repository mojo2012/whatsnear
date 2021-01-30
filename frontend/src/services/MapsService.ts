import { Settings } from "@/configuration/Settings"
import { CreatePointOfInterestRequest } from "@/dtos/CreatePointOfInterestRequest"
import { DistanceData } from "@/dtos/DistanceData"
import { DistanceUnit } from "@/dtos/DistanceUnit"
import { GeoLocation } from "@/dtos/GeoLocation"
import { Payload } from "@/dtos/Payload"
import { PointOfInterest } from "@/dtos/PointOfInterest"
import { BackendNotReachableException } from "@/exceptions/BackendNotReachableException"
import { RequestService } from "@/services/RequestService"
import { getDistance } from "geolib"

export class MapsService {
	private static _instance: MapsService

	private requestService = RequestService.instance

	private constructor() {
		console.log("MapsService instantiated")
	}

	public static get instance(): MapsService {
		if (!MapsService._instance) {
			MapsService._instance = new MapsService()
		}

		return MapsService._instance
	}

	private calculateDistance(point1: GeoLocation, point2: GeoLocation): DistanceData {
		const distanceValueInMeters = getDistance(point1, point2)

		const distance: DistanceData = {
			unit: DistanceUnit.Meters,
			value: distanceValueInMeters
		}

		return distance
	}

	public async addMarker(pointOfInterest: CreatePointOfInterestRequest): Promise<void> {
		const url = Settings.backendUrlV1 + "poi"

		try {
			await this.requestService.post(url, pointOfInterest)
		} catch (ex) {
			throw new BackendNotReachableException("Could not add marker", ex)
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
			const response = await this.requestService.get(url.toString())
			const body: Promise<Payload<PointOfInterest[]>> = await response.json()

			return (await body).data
		} catch (ex) {
			throw new BackendNotReachableException("Could not load markers from backend", ex)
		}
	}
}
