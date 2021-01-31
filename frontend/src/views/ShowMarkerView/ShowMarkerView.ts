/* eslint-disable max-classes-per-file */
import { Settings } from "@/configuration/Settings"
import { MarkerDto } from "@/dtos/MarkerDto"
import { ModalController } from "@/types/IonicTypes"
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
	IonToolbar,
	modalController
} from "@ionic/vue"
import { Options, prop, Vue } from "vue-class-component"
import { GoogleMap, Marker } from "vue3-google-map"

class Props {
	public marker = prop({
		type: Object,
		required: true
	})
}
@Options({
	name: "show-marker-view",
	components: {
		GoogleMap,
		Marker,
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
export class ShowMarkerView extends Vue.with(Props) {
	private modalController: ModalController = modalController

	public apiKey = Settings.googleApiKey

	public onCancelButtonClick(_event: MouseEvent): void {
		console.log("onCancelButtonClick")

		this.modalController.dismiss()
	}

	private get _marker(): MarkerDto {
		return this.marker
	}

	private get title(): string {
		return this._marker.title ?? ""
	}

	private get description(): string {
		return this._marker.description ?? ""
	}

	// public get title(): string {
	// 	return this.pointOfService.title
	// }

	// public get mapCenter(): LatLng {
	// 	return {
	// 		lat: this.pointOfService.location.latitude,
	// 		lng: this.pointOfService.location.longitude
	// }
}
