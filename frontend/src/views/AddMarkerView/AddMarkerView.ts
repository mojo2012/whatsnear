import ExploreContainer from "@/components/ExploreContainer.vue"
import { MapMarkerType } from "@/enums/MapMarkerType"
import { IonContent, IonHeader, IonInput, IonPage, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar } from "@ionic/vue"

export default {
	name: "add-marker-view",
	components: {
		ExploreContainer,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		IonInput,
		IonTextarea,
		IonSelect,
		IonSelectOption,
		IonPage
	},
	computed: {
		markerTypes: () => {
			const enumValues = Object.keys(MapMarkerType)
			return enumValues
		}
	}
}
