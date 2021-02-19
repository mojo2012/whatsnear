/* eslint-disable max-classes-per-file */
import AppToolbar from "@/components/AppToolbar/AppToolbar.vue"
import { AppFacade } from "@/facades/AppFacade"
import { AccountService } from "@/services/AccountService"
import { AuthService } from "@/services/AuthService"
import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonItemDivider,
	IonItemGroup,
	IonLabel,
	IonList,
	IonListHeader,
	IonMenuButton,
	IonPage,
	IonSelect,
	IonSelectOption,
	IonTextarea,
	IonTitle,
	IonToggle,
	IonToolbar
} from "@ionic/vue"
import { add, alertCircleOutline, close, key, logOut, navigate, search } from "ionicons/icons"
import { Options, Vue } from "vue-class-component"

@Options({
	name: "settings-view",
	components: {
		IonMenuButton,
		IonListHeader,
		IonIcon,
		IonItemGroup,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonList,
		IonItem,
		IonButton,
		IonButtons,
		IonLabel,
		IonContent,
		IonInput,
		IonTextarea,
		IonSelect,
		IonSelectOption,
		IonPage,
		IonItemDivider,
		IonToggle,
		AppToolbar
	}
})
export class SettingsView extends Vue {
	public authService = AuthService.instance
	public appFacade = AppFacade.instance
	public accountService = AccountService.instance

	public radiusEntries = [10, 30, 50, 100, 200]
	public maxDistance = 100
	public notifyAboutNewMarkers = false

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

	public async mounted(this: this): Promise<void> {
		try {
			const settings = await this.accountService.getSettings()
			this.maxDistance = settings?.maxDistance ?? 100
			this.notifyAboutNewMarkers = settings?.showOnlyWithinRadius ?? false
		} catch (exception) {
			this.appFacade.showNotificationMessage("Cannot get user settings: " + exception?.message)
		}
	}

	public async onMaxDistanceChanged(event: { detail: { value: number } }): Promise<void> {
		this.maxDistance = event.detail.value
		this.accountService.setMaxDistance(this.maxDistance)
	}

	public async onNotifyAboutNewMarkersChanged(event: { detail: { checked: boolean } }): Promise<void> {
		this.notifyAboutNewMarkers = event.detail.checked
		this.accountService.setNotifyAboutNewMarkers(this.notifyAboutNewMarkers)
	}
}
