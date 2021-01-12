import ExploreContainer from "@/components/ExploreContainer.vue"
import { PointOfServiceTypeIconMapping } from "@/configuration/Mappings"
import { Settings } from "@/configuration/Settings"
import { GeoLocation } from "@/dtos/GeoLocation"
import { LatLng } from "@/dtos/LatLng"
import { MarkerDto } from "@/dtos/MarkerDto"
import { LocationService } from "@/services/LocationService"
import { MapsService } from "@/services/MapsService"
import { MenuController, ModalController } from "@/types/IonicTypes"
import AddMarkerView from "@/views/AddMarkerView/AddMarkerView.vue"
import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonList,
	IonMenu,
	IonMenuButton,
	IonModal,
	IonPage,
	IonSearchbar,
	IonTitle,
	IonToolbar,
	menuController,
	modalController
} from "@ionic/vue"
import { add, close, navigate, search } from "ionicons/icons"
import { Options, Vue } from "vue-class-component"
import { GoogleMap, Marker } from "vue3-google-map"

@Options({
	name: "map-view",
	components: {
		GoogleMap,
		Marker,
		ExploreContainer,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonModal,
		IonContent,
		IonPage,
		IonButtons,
		IonMenuButton,
		IonButton,
		IonSearchbar,
		IonIcon,
		IonInput,
		IonList,
		IonItem,
		IonMenu,
		IonLabel,
		AddMarkerView
	}
})
export class MapView extends Vue {
	// private static nullGeoLocation: LatLng = { lat: 1, lng: 1 }
	// private static distanceFormatter = new Intl.NumberFormat('en-us', {minimumFractionDigits: 2})

	private menuController!: MenuController
	private modalController!: ModalController

	// proprties
	public mapCenter: LatLng = {
		lat: 48,
		lng: 16
	}
	public isSearchBoxVisible = false
	public isSidebarVisible = false
	public markerFilter = ""
	public apiKey = Settings.googleApiKey
	public isShowAddMarkerView = false

	// icons
	public icons = {
		addIcon: add,
		searchIcon: search,
		closeIcon: close,
		navigateIcon: navigate
	}

	private mapsService: MapsService = MapsService.instance
	private locationService = LocationService.getInstance()

	public async created(): Promise<void> {
		console.log("Created")

		this.menuController = menuController
		this.modalController = modalController
		// this.numberFormat = await Globalization.getNumberPattern({ type: "decimal" })
		// this.numberFormatter = Intl.NumberFormat.
	}

	public async mounted(this: this): Promise<void> {
		console.log("Mounted")

		this.goToCurrentPosition()
	}

	public onSearchBarInput(event: InputEvent): void {
		this.markerFilter = (event.target as HTMLInputElement).value as string
	}

	public onMarkerSelected(event: MouseEvent, marker: MarkerDto): void {
		console.log("onMarkerSelected")

		this.mapCenter = marker.position
	}

	public get markers(): MarkerDto[] {
		const currentGeoLocation = this.convertLatLngToGeoLocation(this.mapCenter)

		const markers = this.mapsService
			.getMarkers(currentGeoLocation, 10_000, this.markerFilter) //
			.map((marker) => {
				return {
					//
					position: {
						//
						lat: marker.location.latitude,
						lng: marker.location.longitude
					},
					label: PointOfServiceTypeIconMapping[marker.type],
					title: marker.description,
					distance: (marker.distance.value / 1000).toFixed(1),
					distanceUnit: "km"
				} as MarkerDto
			})

		return markers
	}

	public async goToCurrentPosition(): Promise<void> {
		const coords = await this.locationService.getGeoLocation()

		this.mapCenter = this.convertGeoLocationToLatLng(coords.coords)
	}

	public onLocateMeButtonClick(event: MouseEvent): void {
		this.goToCurrentPosition()
	}

	public async onMenuButtonClick(event: MouseEvent): Promise<void> {
		await this.toggleSidebarVisibility()
	}

	public onSearchButtonClick(event: MouseEvent): void {
		this.toggleSearchBoxVisibility()
	}

	public async onAddMarkerButtonClick(event: MouseEvent): Promise<void> {
		await this.showAddMarkerView()
	}

	public async onAddMarkerClicked(event: any): Promise<void> {
		// await this.showAddMarkerView()
		console.log("onAddMarkerClicked: title=" + event.title)
	}

	private async toggleSidebarVisibility(): Promise<void> {
		this.menuController.toggle()
	}

	public toggleSearchBoxVisibility(): void {
		this.isSearchBoxVisible = !this.isSearchBoxVisible
	}

	public async showAddMarkerView(): Promise<void> {
		this.isShowAddMarkerView = true
	}

	private convertGeoLocationToLatLng(geoLocation: GeoLocation): LatLng {
		return {
			lat: geoLocation.latitude,
			lng: geoLocation.longitude
		}
	}

	private convertLatLngToGeoLocation(value: LatLng): GeoLocation {
		return {
			latitude: value.lat,
			longitude: value.lng
		}
	}
}
