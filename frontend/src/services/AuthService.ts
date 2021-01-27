import { Settings } from "@/configuration/Settings"
import { Authentication } from "@/dtos/Authentication"
import { Payload } from "@/dtos/Payload"
import { UserData } from "@/dtos/UserData"
import { AuthenticationException } from "@/exceptions/BackendNotReachableException copy"

export class AuthService {
	private static _instance: AuthService

	public authentiation?: Authentication

	private constructor() {
		console.log("AuthService instantiated")
	}

	public static get instance(): AuthService {
		if (!AuthService._instance) {
			AuthService._instance = new AuthService()
		}

		return AuthService._instance
	}

	public isAuthenticated(): boolean {
		return this.authentiation?.token != null && this.authentiation?.validTo != null
	}

	public async authenticate(username: string, password: string): Promise<void> {
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

			const data = (await result).data

			if (data) {
				this.authentiation = data
			} else {
				throw new AuthenticationException("Authentication failed")
			}
		} catch (ex) {
			console.debug("Could not authenticate user")
			throw ex
		}
	}

	public async register(data: UserData): Promise<void> {
		const url = Settings.backendUrlV1 + "account/register"

		try {
			const conf = {
				method: "POST",
				headers: [],
				body: JSON.stringify(data)
			}
			const result: Promise<Payload<Authentication>> = await (await fetch(url, conf)).json()

			console.log("result: " + result)

			const reg = (await result).data

		} catch (ex) {
			console.debug("Could not register user")
			throw ex
		}
	}
}
