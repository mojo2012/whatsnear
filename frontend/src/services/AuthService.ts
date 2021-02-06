import { Settings } from "@/configuration/Settings"
import { Authentication } from "@/dtos/Authentication"
import { Payload } from "@/dtos/Payload"
import { UserData } from "@/dtos/UserData"
import { AuthenticationException } from "@/exceptions/AuthenticationException"
import { RegistrationException } from "@/exceptions/RegistrationException"
import { LocalStorageService } from "@/services/LocalStorageService"
import { Optional } from "@/types/Optional"
import { RequestUtil } from "@/utils/RequestUtil"

export class AuthService {
	private static _instance: AuthService

	private localStorageService = LocalStorageService.instance

	public authentication?: Authentication | null

	private constructor() {
		console.info("AuthService instantiated")
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

	public async loadStoredAuthentication(): Promise<Optional<Authentication>> {
		const auth = await this.localStorageService.get<Authentication>("authentication")

		this.authentication = auth

		return auth
	}

	public async getCurrentUsername(): Promise<Optional<string>> {
		const currentAuthentication = await this.loadStoredAuthentication()
		return currentAuthentication?.uid
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
			const result: Promise<Payload<Authentication>> = await (await RequestUtil.fetch(url, conf)).json()

			console.info("result: " + result)

			const tokenData = (await result).data
			tokenData.uid = username

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
			const result: Promise<Payload<Authentication>> = await (await RequestUtil.fetch(url, conf)).json()

			console.info("result: " + result)

			const tokenData = (await result).data
			tokenData.uid = registrationData.username

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
