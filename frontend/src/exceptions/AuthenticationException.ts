import { BaseException } from "@/exceptions/BaseException"

export class AuthenticationException extends BaseException {
	public constructor(message: string, rootCause?: Error) {
		super(message, rootCause)
	}
}
