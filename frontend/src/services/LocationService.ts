import { GeolocationPlugin, GeolocationPosition, Plugins } from "@capacitor/core"

export class LocationService {
	private static _instance: LocationService

	private geolocation: GeolocationPlugin

	private constructor() {
		this.geolocation = Plugins.Geolocation
	}

	public async getGeoLocation(): Promise<GeolocationPosition> {
		return this.geolocation.getCurrentPosition({
			enableHighAccuracy: true,
			timeout: 5000
		})
	}

	public static get instance(): LocationService {
		if (!LocationService._instance) {
			LocationService._instance = new LocationService()
		}

		return LocationService._instance
	}
}
