export abstract class BaseException extends Error {
	public readonly rootCause?: Error

	public constructor(message: string, rootCause?: Error) {
		super(message)

		this.rootCause = rootCause
	}
}
