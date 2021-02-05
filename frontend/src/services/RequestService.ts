import { AuthService } from "@/services/AuthService"
import { RequestUtil } from "@/utils/RequestUtil"

export class RequestService {
	private static _instance: RequestService

	public authService = AuthService.instance

	private constructor() {
		//
	}

	public static get instance(): RequestService {
		if (!RequestService._instance) {
			RequestService._instance = new RequestService()
		}

		return RequestService._instance
	}

	public async post(url: string, body?: unknown): Promise<Response> {
		const headers = await this.createAuthenticationHeader()
		const options = {
			method: "POST",
			headers: headers,
			body: JSON.stringify(body)
		}

		return await RequestUtil.fetch(url, options)
	}

	public async get(url: string): Promise<Response> {
		const headers = await this.createAuthenticationHeader()
		const options = {
			method: "GET",
			headers: headers
		}

		return await RequestUtil.fetch(url, options)
	}

	private async createAuthenticationHeader(): Promise<Headers> {
		const authentication = await this.authService.loadStoredAuthentication()
		const headers = new Headers()

		if (authentication?.token) {
			headers.append("Authorization", authentication.token)
		}

		return headers
	}
}
