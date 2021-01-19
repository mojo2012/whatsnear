import ExploreContainer from "@/components/ExploreContainer.vue"
import { POINT_OF_SERVICE_MAPPING } from "@/configuration/Mappings"
import { Settings } from "@/configuration/Settings"
import { CreatePointOfInterestRequest } from "@/dtos/CreatePointOfInterestRequest"
import { GeoLocation } from "@/dtos/GeoLocation"
import { LatLng } from "@/dtos/LatLng"
import { MarkerDto } from "@/dtos/MarkerDto"
import { LocationService } from "@/services/LocationService"
import { MapsService } from "@/services/MapsService"
import { MenuController, ModalController } from "@/types/IonicTypes"
import { MathUtil } from "@/utils/MathUtil"
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
	private static DEFAULT_MAP_CENTER: LatLng = {
		lat: 48,
		lng: 16
	}

	public mapCenter: LatLng = MapView.DEFAULT_MAP_CENTER

	public currentPositionMarker: MarkerDto = {
		position: this.mapCenter
	}

	public isSearchBoxVisible = false
	public isSidebarVisible = false
	public markerFilter = ""
	public apiKey = Settings.googleApiKey
	public isShowAddMarkerView = false
	public markers: MarkerDto[] = []

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

		await this.goToCurrentPosition()

		this.currentPositionMarker = { position: this.mapCenter, label: "+" }

		this.syncMarkers()
	}

	public async onSearchBarInput(event: InputEvent): Promise<void> {
		this.markerFilter = (event.target as HTMLInputElement).value as string
		this.syncMarkers()
	}

	public onMarkerSelected(event: MouseEvent, marker: MarkerDto): void {
		console.log("onMarkerSelected")

		this.mapCenter = marker.position
	}

	public async syncMarkers(): Promise<void> {
		const currentGeoLocation = this.convertLatLngToGeoLocation(this.mapCenter)
		this.markers = (await this.mapsService.getMarkers(currentGeoLocation, 100_000, this.markerFilter)) //
			.map((marker) => {
				const label = POINT_OF_SERVICE_MAPPING.filter((i) => i.code === marker.type)[0]?.icon

				return {
					//
					position: {
						//
						lat: marker.location.latitude,
						lng: marker.location.longitude
					},
					label: label,
					title: marker.description,
					distance: (marker.distance.value / 1000).toFixed(1),
					distanceUnit: "km"
				} as MarkerDto
			})
	}

	public async goToCurrentPosition(): Promise<void> {
		const coords = await this.locationService.getGeoLocation()
		this.mapCenter = this.convertGeoLocationToLatLng(coords.coords)
	}

	public async onLocateMeButtonClick(event: MouseEvent): Promise<void> {
		await this.goToCurrentPosition()
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

	public async onAddMarkerClicked(event: CreatePointOfInterestRequest): Promise<void> {
		console.log("onAddMarkerClicked: title=" + event.title)
		await this.mapsService.addMarker(event)
		await this.syncMarkers()
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
		// need to make sure that the coordinates change a bit for vue to pickup the change
		return {
			lat: geoLocation.latitude + MathUtil.random(0, 0.000001),
			lng: geoLocation.longitude + MathUtil.random(0, 0.000001)
		}
	}

	private convertLatLngToGeoLocation(value: LatLng): GeoLocation {
		return {
			latitude: value.lat,
			longitude: value.lng
		}
	}
}
