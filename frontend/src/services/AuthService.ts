import { Settings } from "@/configuration/Settings"
import { Authentication } from "@/dtos/Authentication"
import { Payload } from "@/dtos/Payload"
import { UserData } from "@/dtos/UserData"
import { AuthenticationException } from "@/exceptions/AuthenticationException"
import { RegistrationException } from "@/exceptions/RegistrationException"
import { LocalStorageService } from "@/services/LocalStorageService"

export class AuthService {
	private static _instance: AuthService

	private localStorageService = LocalStorageService.instance

	public authentication?: Authentication | null

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
		return this.authentication?.token != null && this.authentication?.validTo != null
	}

	public async loadStoredAuthentication(): Promise<void> {
		const auth = await this.localStorageService.get<Authentication>("authentication")

		this.authentication = auth
	}

	public async storeAuthentication(authentication?: Authentication | null): Promise<void> {
		this.authentication = authentication

		if (authentication) {
			await this.localStorageService.set<Authentication>("authentication", authentication)
		} else {
			await this.localStorageService.remove("authentication")
		}
	}

	public logout(): void {
		this.storeAuthentication(null)
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

			const tokenData = (await result).data

			if (tokenData) {
				await this.storeAuthentication(tokenData)
			} else {
				throw new AuthenticationException("Authentication failed")
			}
		} catch (ex) {
			console.debug("Could not authenticate user")
			throw ex
		}
	}

	public async register(registrationData: UserData): Promise<void> {
		const url = Settings.backendUrlV1 + "account/register"

		try {
			const conf = {
				method: "POST",
				headers: [],
				body: JSON.stringify(registrationData)
			}
			const result: Promise<Payload<Authentication>> = await (await fetch(url, conf)).json()

			console.log("result: " + result)

			const tokenData = (await result).data

			if (tokenData) {
				await this.storeAuthentication(tokenData)
			} else {
				throw new RegistrationException("Registration failed")
			}
		} catch (ex) {
			console.debug("Could not register user")
			throw ex
		}
	}
}
