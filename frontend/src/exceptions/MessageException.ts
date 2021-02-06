import { BaseException } from "@/exceptions/BaseException"

export class MessageException extends BaseException {
	public constructor(message: string, rootCause?: Error) {
		super(message, rootCause)
	}
}
