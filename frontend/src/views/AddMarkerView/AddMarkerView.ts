/* eslint-disable max-classes-per-file */
import ExploreContainer from "@/components/ExploreContainer.vue"
import { PointOfServiceTypeIconMappingType, POINT_OF_SERVICE_MAPPING } from "@/configuration/Mappings"
import { Settings } from "@/configuration/Settings"
import { CreatePointOfInterestRequest } from "@/dtos/CreatePointOfInterestRequest"
import { GeoLocation } from "@/dtos/GeoLocation"
import { LatLng } from "@/dtos/LatLng"
import { PointOfServiceType } from "@/enums/PointOfServiceType"
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
	public mapLat = prop({
		type: Number,
		required: true
	})
	public mapLon = prop({
		type: Number,
		required: true
	})
}
@Options({
	name: "add-marker-view",
	emits: ["onAddMarker"],
	components: {
		GoogleMap,
		Marker,
		ExploreContainer,
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
export class AddMarkerView extends Vue.with(Props) {
	private modalController: ModalController = modalController

	public apiKey = Settings.googleApiKey
	public title = ""
	public description = ""
	public type?: PointOfServiceType

	public onCancelButtonClick(_event: MouseEvent): void {
		console.log("onCancelButtonClick")

		this.modalController.dismiss()
	}

	public onAddButtonClick(_event: MouseEvent): void {
		console.log("onAddButtonClick")

		const mapCenter: GeoLocation = {
			latitude: this.mapLat,
			longitude: this.mapLon
		}

		const newPointOfService: CreatePointOfInterestRequest = {
			title: this.title,
			description: this.description,
			location: mapCenter,
			type: this.type ? this.type : PointOfServiceType.NEED_HELP
		}

		this.$emit("onAddMarker", newPointOfService)

		this.modalController.dismiss()
	}

	public get markerTypes(): PointOfServiceTypeIconMappingType[] {
		return POINT_OF_SERVICE_MAPPING
	}

	public get mapCenter(): LatLng {
		return { lat: this.mapLat, lng: this.mapLon }
	}
}
