/* eslint-disable max-classes-per-file */
import AppToolbar from "@/components/AppToolbar/AppToolbar.vue"
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
	public accountService = AccountService.instance

	public radiusEntries = [10, 30, 50, 100, 200]
	public maxDistance = 100
	public notifyAboutNewMarkers = true

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

	public async created(): Promise<void> {
		const settings = await this.accountService.getSettings()
		this.maxDistance = settings.maxDistance ?? 100
	}
}
