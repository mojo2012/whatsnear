import { ConditionalPick } from "type-fest"

// export type Builder<ObjectType> = {
// 	// [KeyType in keyof ObjectType]: ObjectType
// 	[ValueType in valueof]
// 	[KeyType in keyof ObjectType]: ObjectType
// }

class Data {
	public init(): void {
		//
	}

	public get data(): string {
		return ""
	}

	public increment(): number {
		return 1
	}

	public decrement(i: number): number {
		return i--
	}
}

type MethodsOnly<T> = ConditionalPick<T, (arg: any) => void>

const data: MethodsOnly<Data> = new Data()
data.init()

console.log(data)

// export const build = <T>(object: T): Builder<T> => {
// 	//
// 	const builder = {}
// }
