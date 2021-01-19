import { Supplier } from "@/types/Supplier"

export class AsyncUtil {
	public static run<T>(asyncFunction: Supplier<Promise<T>>): Promise<T> {
		const result = (async (): Promise<T> => {
			return await asyncFunction()
		})()

		// let ret: T
		// result.then((v) => (ret = v))

		return result
	}
}
