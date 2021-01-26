export interface Payload<T> {
	httpStatus: string
	data: T
	errors?: Record<string, string>
	warnings?: Record<string, string>
	infos?: Record<string, string>
}
