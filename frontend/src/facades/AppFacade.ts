import { LatLng } from "@/dtos/LatLng"
import { LocationService } from "@/services/LocationService"
import { MapsService } from "@/services/MapsService"
import { RegisterOrLoginType } from "@/types/helper-types"
import { MenuController, ModalController } from "@/types/IonicTypes"
import LoginView from "@/views/LoginView/LoginView.vue"
import { menuController, modalController } from "@ionic/vue"

export class AppFacade {
	private static _instance: AppFacade

	private menuController: MenuController = menuController
	private modalController: ModalController = modalController
	private locationService = LocationService.instance
	private mapsService = MapsService.instance

	private static DEFAULT_MAP_CENTER: LatLng = {
		lat: 48,
		lng: 16
	}

	public currentPosition: LatLng = AppFacade.DEFAULT_MAP_CENTER
	// public _isShowLoginView = false
	public loginErrorMessage = ""
	private loginDialog!: HTMLIonModalElement

	private constructor() {
		console.log("AuthService instantiated")
	}

	public static get instance(): AppFacade {
		if (!AppFacade._instance) {
			AppFacade._instance = new AppFacade()
		}

		return AppFacade._instance
	}

	public async toggleSidebarVisibility(): Promise<void> {
		this.menuController.toggle()
	}

	public async goToCurrentPosition(): Promise<void> {
		const coords = await this.locationService.getGeoLocation()
		this.currentPosition = await this.mapsService.convertGeoLocationToLatLng(coords.coords)
	}

	public async showLoginView(value = true): Promise<void> {
		if (value) {
			// create it only once?
			this.loginDialog = await this.modalController.create({
				component: LoginView,
				componentProps: {
					// it would be cool to not use this hack but instead subscribe an even handler like in the HTML component
					onBeforeLogin: this.onBeforeLogin.bind(this),
					onLoginDismiss: this.onLoginDismiss.bind(this),
					onLoginSuccess: this.onLoginSuccess.bind(this),
					onLoginFailed: this.onLoginFailed.bind(this)
				},
				swipeToClose: true,
				keyboardClose: true,
				mode: "ios",
				backdropDismiss: true,
				cssClass: "login-view"
			})

			this.loginErrorMessage = ""
			this.loginDialog.present()
		} else {
			this.loginDialog.dismiss()
			this.loginErrorMessage = ""
		}
	}

	public onLoginSuccess(this: this, type: RegisterOrLoginType): void {
		console.log("onLoginSuccess")

		this.showLoginView(false)
	}

	public onBeforeLogin(this: this): void {
		console.log("onBeforeLogin")
	}

	public onLoginDismiss(this: this): void {
		this.showLoginView(false)
	}

	public async onLoginFailed(this: this, type: RegisterOrLoginType): Promise<void> {
		console.log("onLoginFailed")

		this.loginErrorMessage = `${type} not successful`
	}
}
