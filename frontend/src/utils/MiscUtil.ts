// eslint-disable-next-line @typescript-eslint/ban-types
export const tryAndLog = (runnable?: Function, errorMessage?: string | null, ...args: unknown[]): void => {
	try {
		if (runnable) {
			runnable(args)
		}
	} catch (err) {
		console.error(errorMessage ?? "Error executing runnable")
	}
}
