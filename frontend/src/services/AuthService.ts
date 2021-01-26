import { Settings } from "@/configuration/Settings"

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

	public async handleLogin(username: String, password: String): Promise<{ data: {token: String, validTo: String}}> {
		console.log(username + ":" + password)

		const url = Settings.backendUrlV1 + "account/login"

		let form = {
			uid: username,
			password: password
		}

		try {
			const result: Promise<{ data: {token: String, validTo: String} }> = await (await fetch(url, { method: "POST", headers: [], body: JSON.stringify(form) })).json()
			console.log("result: " + result)
			return (await result)
		} catch (ex) {
			console.error("Could not authenticate user", ex)
			throw ex
		}
	}

}
