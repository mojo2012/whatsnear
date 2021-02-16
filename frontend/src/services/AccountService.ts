import { Settings } from "@/configuration/Settings"
import { Payload } from "@/dtos/Payload"
import { UserData } from "@/dtos/UserData"
import { BackendNotReachableException } from "@/exceptions/BackendNotReachableException"
import { RequestService } from "@/services/RequestService"

export class AccountService {
	private static _instance: AccountService
	private requestService = RequestService.instance

	private constructor() {
		console.info("AccountService instantiated")
	}

	public static get instance(): AccountService {
		if (!AccountService._instance) {
			AccountService._instance = new AccountService()
		}

		return AccountService._instance
	}

	public async getSettings(): Promise<UserData> {
		const url = new URL(Settings.backendUrlV1 + "account/status")

		try {
			const response = await this.requestService.get(url.toString())
			const body: Promise<Payload<UserData>> = await response.json()

			return (await body).data
		} catch (ex) {
			throw new BackendNotReachableException("Could not load markers from backend", ex as Error)
		}
	}
}
