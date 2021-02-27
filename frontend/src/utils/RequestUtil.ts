interface Options extends RequestInit {
	timeout?: number
}

export class RequestUtil {
	/**
	 * Timeouts a regular fetch request after 8sec by default. Can be overridden in the options parameter
	 */
	public static async fetch(resource: RequestInfo, options?: Options): Promise<Response> {
		const timeout = options?.timeout ?? 8000
		const controller = new AbortController()
		const id = setTimeout(() => controller.abort(), timeout)

		const response = await fetch(resource, {
			...options,
			mode: "no-cors",
			signal: controller.signal
		})

		clearTimeout(id)

		return response
	}
}
