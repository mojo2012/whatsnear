import { BaseException } from "@/exceptions/BaseException"

export class BackendNotReachableException extends BaseException {
	public constructor(message: string, rootCause: Error) {
		super(message, rootCause)
	}
}
