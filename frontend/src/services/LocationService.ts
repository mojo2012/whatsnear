import { GeolocationPlugin, GeolocationPosition, Plugins } from "@capacitor/core"

export class LocationService {
	private static instance: LocationService

	private geolocation: GeolocationPlugin

	public constructor() {
		this.geolocation = Plugins.Geolocation
	}

	public async getGeoLocation(): Promise<GeolocationPosition> {
		return this.geolocation.getCurrentPosition({
			enableHighAccuracy: true
		})
	}

	public static getInstance(): LocationService {
		if (!LocationService.instance) {
			LocationService.instance = new LocationService()
		}

		return LocationService.instance
	}
}

export const instance = new LocationService()
