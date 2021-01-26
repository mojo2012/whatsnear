import ExploreContainer from "@/components/ExploreContainer.vue"
import { POINT_OF_SERVICE_MAPPING } from "@/configuration/Mappings"
import { Settings } from "@/configuration/Settings"
import { CreatePointOfInterestRequest } from "@/dtos/CreatePointOfInterestRequest"
import { GeoLocation } from "@/dtos/GeoLocation"
import { LatLng } from "@/dtos/LatLng"
import { MarkerDto } from "@/dtos/MarkerDto"
import { AuthService } from "@/services/AuthService"
import { LocationService } from "@/services/LocationService"
import { MapsService } from "@/services/MapsService"
import { MenuController, ModalController } from "@/types/IonicTypes"
import { MathUtil } from "@/utils/MathUtil"
import AddMarkerView from "@/views/AddMarkerView/AddMarkerView.vue"
import LoginView from "@/views/LoginView/LoginView.vue"
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
	IonToast,
	IonToolbar,
	menuController,
	modalController
} from "@ionic/vue"
import { add, close, logIn, navigate, search } from "ionicons/icons"
import { Options, Vue } from "vue-class-component"
import { useRouter } from "vue-router"
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
		IonToast,
		AddMarkerView,
		LoginView
	}
})
export class MapView extends Vue {
	// private static nullGeoLocation: LatLng = { lat: 1, lng: 1 }
	// private static distanceFormatter = new Intl.NumberFormat('en-us', {minimumFractionDigits: 2})

	private router = useRouter()
	private menuController!: MenuController
	private modalController!: ModalController
	private mapsService: MapsService = MapsService.instance
	private locationService = LocationService.instance
	public authService = AuthService.instance

	// proprties
	private static DEFAULT_MAP_CENTER: LatLng = {
		lat: 48,
		lng: 16
	}

	public mapCenter: LatLng = MapView.DEFAULT_MAP_CENTER

	public currentPositionMarker: MarkerDto = {
		position: this.mapCenter
	}

	public notificationMessage = ""
	public isSearchBoxVisible = false
	public isSidebarVisible = false
	public markerFilter = ""
	public apiKey = Settings.googleApiKey
	public isShowAddMarkerView = false
	public isShowLoginView = false
	public markers: MarkerDto[] = []

	// icons
	public icons = {
		addIcon: add,
		searchIcon: search,
		closeIcon: close,
		navigateIcon: navigate,
		loginIcon: logIn
	}

	public async created(): Promise<void> {
		console.log("Created")

		this.menuController = menuController
		this.modalController = modalController
	}

	public async mounted(this: this): Promise<void> {
		console.log("Mounted")

		try {
			await this.goToCurrentPosition()
			this.createCurrentPositionMarker()
			await this.syncMarkers()
		} catch (exception) {
			this.showNotificationMessage("Cannot get current geo location.")
		}
	}

	private createCurrentPositionMarker(): void {
		this.currentPositionMarker = { position: this.mapCenter, label: "+" }
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

		try {
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
		} catch (exception) {
			console.log(exception.message)
			this.showNotificationMessage(exception.message)
		}
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

	public async onLoginButtonClick(event: MouseEvent): Promise<void> {
		console.log("onLoginButtonClick: " + event)
		await this.showLoginView()
	}

	public async showLoginView(): Promise<void> {
		this.isShowLoginView = true
	}

	public async onAddMarker(event: CreatePointOfInterestRequest): Promise<void> {
		console.log("onAddMarkerClicked: title=" + event.title)
		await this.mapsService.addMarker(event)
		await this.syncMarkers()
	}

	public onLoginSuccess(): void {
		console.log("onLoginSuccess")

		this.isShowLoginView = false

		this.router.push("/tabs/map")
	}

	public async onLoginFailed(): Promise<Promise<void>> {
		console.log("onLoginFailed")

		// const errorAlert = await alertController.create({
		// 	header: "Failed",
		// 	subHeader: "Sign in Failed",
		// 	message: "Login not successful",
		// 	buttons: ["OK"]
		// })
		// await errorAlert.present()

		this.showNotificationMessage("Login credentials not valid.")
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

	private async showNotificationMessage(message: string): Promise<void> {
		this.notificationMessage = message

		// const toast = await toastController.create({
		// 	header: message,
		// 	position: "bottom",
		// 	translucent: true,
		// 	buttons: [
		// 		{
		// 			text: "OK",
		// 			role: "cancel",
		// 			handler: () => {
		// 				// console.log("Cancel clicked")
		// 			}
		// 		}
		// 	]
		// })

		// toast.present()
	}

	private convertLatLngToGeoLocation(value: LatLng): GeoLocation {
		return {
			latitude: value.lat,
			longitude: value.lng
		}
	}
}
