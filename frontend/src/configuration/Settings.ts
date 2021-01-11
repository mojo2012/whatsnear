export class Settings {
	public static get googleApiKey(): string {
		return process.env.VUE_APP_GOOGLE_MAPS_API_KEY
	}

	public static get version(): string {
		return process.env.VUE_APP_VERSION
	}
}
