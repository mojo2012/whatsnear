export class Settings {
	public static get googleApiKey(): string {
		return process.env.VUE_APP_GOOGLE_MAPS_API_KEY
	}

	public static get version(): string {
		return process.env.VUE_APP_VERSION
	}

	public static get backendUrl(): string {
		return process.env.VUE_APP_BACKEND_BASE_URL
	}

	public static get backendUrlV1(): string {
		return Settings.backendUrl + "/v1/"
	}

	public static get mapRadius(): number {
		return 200_000
	}
}
