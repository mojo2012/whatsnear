import { BaseException } from "@/exceptions/BaseException"

export class RegistrationException extends BaseException {
	public constructor(message: string, rootCause?: Error) {
		super(message, rootCause)
	}
}
