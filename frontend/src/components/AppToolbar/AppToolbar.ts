/* eslint-disable max-classes-per-file */
import { AppFacade } from "@/facades/AppFacade"
import { AuthService } from "@/services/AuthService"
import LoginView from "@/views/LoginView/LoginView.vue"
import { IonButton, IonButtons, IonHeader, IonIcon, IonMenu, IonMenuButton, IonModal, IonSearchbar, IonToolbar } from "@ionic/vue"
import { add, alertCircleOutline, close, key, logOut, navigate, search } from "ionicons/icons"
import { Options, prop, Vue } from "vue-class-component"

class Props {
	public menuId = prop({
		type: String,
		required: false
	})
}

@Options({
	name: "app-toolbar",
	components: {
		IonToolbar,
		IonButton,
		IonButtons,
		IonIcon,
		IonMenuButton,
		IonModal,
		IonMenu,
		LoginView,
		IonHeader,
		IonSearchbar
	}
})
export default class AppToolbar extends Vue.with(Props) {
	public authService = AuthService.instance
	public appFacade = AppFacade.instance

	// icons
	public icons = {
		addIcon: add,
		searchIcon: search,
		closeIcon: close,
		navigateIcon: navigate,
		loginIcon: key,
		logoutIcon: logOut,
		alertCircle: alertCircleOutline
	}

	public created(): void {
		console.log("Created")
	}

	public async mounted(this: this): Promise<void> {
		console.log("Mounted")
	}

	public async onMenuButtonClick(event: MouseEvent): Promise<void> {
		await this.appFacade.toggleSidebarVisibility(this.menuId)
	}

	public async onLoginButtonClick(event: MouseEvent): Promise<void> {
		console.log("onLoginButtonClick: " + event)
		await this.appFacade.showLoginView()
	}

	public async onLogoutButtonClick(event: MouseEvent): Promise<void> {
		console.log("onLogoutButtonClick: " + event)
		await this.authService.logout()
	}
}
