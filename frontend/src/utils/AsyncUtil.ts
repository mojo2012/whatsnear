import { Optional } from "@/types/Optional"
import { Supplier } from "@/types/Supplier"

export class AsyncUtil {
	public static await<T>(asyncFunction: Supplier<Promise<T>>): Optional<T> {
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

const result = AsyncUtil.await(() => fetch("https://httpstat.us/200?sleep=5000"))

console.log(result)
