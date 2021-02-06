import { Plugins } from "@capacitor/core"

const { Storage } = Plugins

export class LocalStorageService {
	private static _instance: LocalStorageService

	private localStorage = Storage

	private constructor() {
		console.info("LocalStorageService instantiated")
	}

	public static get instance(): LocalStorageService {
		if (!LocalStorageService._instance) {
			LocalStorageService._instance = new LocalStorageService()
		}

		return LocalStorageService._instance
	}

	public async set<T>(key: string, value: T): Promise<void> {
		await Storage.set({
			key: key,
			value: JSON.stringify(value)
		})
	}

	public async get<T>(key: string): Promise<T | null> {
		const ret = await Storage.get({ key: key })

		if (ret.value) {
			return JSON.parse(ret.value) as T
		}

		return null
	}

	public async remove(key: string): Promise<void> {
		await Storage.remove({ key: key })
	}

	public async keys(): Promise<string[]> {
		return await (await Storage.keys()).keys
	}

	public async clear(): Promise<void> {
		await Storage.clear()
	}
}
