import { Supplier } from "@/types/Supplier"

export class AsyncUtil {
	public static run<T>(asyncFunction: Supplier<Promise<T>>): T | undefined | null {
		let result: T | undefined | null
		;(async (): Promise<void> => {
			asyncFunction()
				.then((value) => (result = value))
				.catch((err) => (result = null))
		})()

		// let ret: T
		// result.then((v) => (ret = v))

		return result
	}
}

const result = AsyncUtil.run(() => fetch("https://httpstat.us/200?sleep=5000"))

console.log(result)
