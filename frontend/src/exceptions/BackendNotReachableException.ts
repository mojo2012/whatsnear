export class BackendNotReachableException extends Error {
	public readonly rootCause: Error

	public constructor(message: string, rootCause: Error) {
		super(message)

		this.rootCause = rootCause
	}
}
