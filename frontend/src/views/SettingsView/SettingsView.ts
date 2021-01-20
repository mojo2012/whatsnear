/* eslint-disable max-classes-per-file */
import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonInput,
	IonItem,
	IonLabel,
	IonList,
	IonPage,
	IonSelect,
	IonSelectOption,
	IonTextarea,
	IonTitle,
	IonToolbar
} from "@ionic/vue"
import { Options, Vue } from "vue-class-component"

@Options({
	name: "add-marker-view",
	emits: ["onAddMarker"],
	components: {
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
		IonPage
	}
})
export class SettingsView extends Vue {
	public radiusEntries = [50, 100, 200, 500, 1000]
	public maxRadius = 100
	public notifyAboutNewMarkers = true
}
