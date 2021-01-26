import { Settings } from "@/configuration/Settings"
import { Authentication } from "@/dtos/Authentication"
import { Payload } from "@/dtos/Payload"

export class AuthService {
	private static _instance: AuthService

	private constructor() {
		console.log("AuthService instantiated")
	}

	public static get instance(): AuthService {
		if (!AuthService._instance) {
			AuthService._instance = new AuthService()
		}

		return AuthService._instance
	}

	public async handleLogin(username: string, password: string): Promise<Authentication> {
		console.log(username + ":" + password)

		const url = Settings.backendUrlV1 + "account/login"

		const form = {
			uid: username,
			password: password
		}

		try {
			const conf = {
				method: "POST",
				headers: [],
				body: JSON.stringify(form)
			}
			const result: Promise<Payload<Authentication>> = await (await fetch(url, conf)).json()

			console.log("result: " + result)

			return (await result).data
		} catch (ex) {
			console.error("Could not authenticate user", ex)
			throw ex
		}
	}
}
