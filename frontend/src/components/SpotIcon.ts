import { IonIcon } from "@ionic/vue"
import { square } from "ionicons/icons"
import { Options, Vue } from "vue-class-component"

@Options({
	name: "spot-icon",
	// watch: {
	// 	async icon(icon: string) {
	// 		await this.loadSvgIcon(icon)
	// 	}
	// },
	components: {
		IonIcon
	}
})
export class SpotIcon extends Vue {
	public icon = "square"
	public _iconSvg = square

	public created(): void {
		console.log("Created")
	}

	public async mounted(this: this): Promise<void> {
		console.log(`Mounted ${this.icon}`)

		await this.loadSvgIcon(this.icon)
	}

	public async loadSvgIcon(icon: string): Promise<void> {
		await import("ionicons/icons").then((module: any) => {
			if (module && module.icon) {
				console.log(`Loaded SVG icon: ${this.iconSvg}`)
				// this.iconSvg = module.icon as string
			} else {
				// error
			}
		})
	}

	public set iconSvg(value: string) {
		this._iconSvg = value
	}

	public get iconSvg(): string {
		return this._iconSvg
	}

	// public set icon(icon: string) {
	// 	;(async () => {
	// 		await this.loadSvgIcon(icon)
	// 	})()

	// 	this._icon = icon
	// }

	// public get icon(): string {
	// 	return this._icon
	// }
}
