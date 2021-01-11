import { Globalization } from "@ionic-native/globalization"

export class NumberFormatter {
	public currentLocale!: string

	private constructor(public pattern: string) {
		this.init()
	}

	private async init(): Promise<void> {
		this.currentLocale = await (await Globalization.getLocaleName()).value
	}

	public format(value: number, locale: string): string {
		// return Intl.NumberFormat()
		// Globalization.get
		return Intl.NumberFormat(locale, {}).format(value)
	}

	public static for(pattern: string): NumberFormatter {
		return new NumberFormatter(pattern)
	}
}
