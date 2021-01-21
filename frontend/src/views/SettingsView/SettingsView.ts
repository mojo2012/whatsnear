/* eslint-disable max-classes-per-file */
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
	IonPage,
	IonSelect,
	IonSelectOption,
	IonTextarea,
	IonTitle,
	IonToggle,
	IonToolbar
} from "@ionic/vue"
import { Options, Vue } from "vue-class-component"

@Options({
	name: "settings-view",
	components: {
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
		IonToggle
	}
})
export class SettingsView extends Vue {
	public radiusEntries = [50, 100, 200, 500, 1000]
	public maxRadius = 100
	public notifyAboutNewMarkers = true
}
