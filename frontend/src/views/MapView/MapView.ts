import AppToolbar from "@/components/AppToolbar/AppToolbar.vue"
import { POINT_OF_SERVICE_MAPPING } from "@/configuration/Mappings"
import { Settings } from "@/configuration/Settings"
import { CreatePointOfInterestRequest } from "@/dtos/CreatePointOfInterestRequest"
import { DistanceUnit } from "@/dtos/DistanceUnit"
import { MarkerDto } from "@/dtos/MarkerDto"
import { PointOfServiceType } from "@/enums/PointOfServiceType"
import { AppFacade } from "@/facades/AppFacade"
import { AuthService } from "@/services/AuthService"
import { MapsService } from "@/services/MapsService"
import { MessageService } from "@/services/MessageService"
import { MathUtil } from "@/utils/MathUtil"
import AddMarkerView from "@/views/AddMarkerView/AddMarkerView.vue"
import ShowMarkerView from "@/views/ShowMarkerView/ShowMarkerView.vue"
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
	IonToolbar
} from "@ionic/vue"
import { add, alertCircleOutline, close, key, logOut, navigate, search } from "ionicons/icons"
import { Options, Vue } from "vue-class-component"
import { Circle, GoogleMap, Marker } from "vue3-google-map"

@Options({
	name: "map-view",
	components: {
		GoogleMap,
		Circle,
		Marker,
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
		ShowMarkerView,
		AppToolbar
	}
})
export class MapView extends Vue {
	// private static distanceFormatter = new Intl.NumberFormat('en-us', {minimumFractionDigits: 2})

	private mapsService: MapsService = MapsService.instance
	public authService = AuthService.instance
	public appFacade = AppFacade.instance
	public messageService = MessageService.instance

	// proprties

	public currentPositionMarker: MarkerDto = {
		position: this.appFacade.currentPosition,
		type: PointOfServiceType.UNKNOWN
	}

	public currentPositionCircle = {
		center: this.appFacade.currentPosition,
		radius: Settings.mapRadius,
		strokeColor: "#ab00d7",
		strokeOpacity: 1.0,
		strokeWeight: 4,
		fillColor: "#ab00d7",
		fillOpacity: 0.05
	}

	// public notificationMessage = ""
	public isSearchBoxVisible = false
	public isSidebarVisible = false
	public markerFilter = ""
	public apiKey = Settings.googleApiKey
	public isShowMarkerView = false
	public isShowAddMarkerView = false
	public selectedMarker!: MarkerDto
	public markers: MarkerDto[] = []

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
		console.info("Created")
	}

	public async mounted(this: this): Promise<void> {
		console.info("Mounted")

		try {
			await this.appFacade.goToCurrentPosition()
			this.createCurrentPositionMarker()

			await this.syncMarkers()
		} catch (exception) {
			this.appFacade.showNotificationMessage("Cannot get current geo location: " + exception?.message)
		}
	}

	private createCurrentPositionMarker(): void {
		const position = this.appFacade.currentPosition

		this.currentPositionMarker = {
			position: position,
			label: "+",
			type: PointOfServiceType.UNKNOWN
		}

		this.currentPositionCircle = {
			...this.currentPositionCircle,
			center: position
		}
	}

	public async onSearchBarInput(event: InputEvent): Promise<void> {
		this.markerFilter = (event.target as HTMLInputElement).value as string
		this.syncMarkers()
	}

	public async onLocateMeButtonClick(event: MouseEvent): Promise<void> {
		await this.appFacade.goToCurrentPosition()
	}

	public onMarkerSelected(event: MouseEvent, marker: MarkerDto): void {
		console.info("onMarkerSelected")

		this.navigateToMarker(marker)
	}

	public async onCreateConversation(marker: MarkerDto): Promise<void> {
		this.isShowMarkerView = false

		if (marker.id) {
			const conversationId = await this.messageService.createConversation(marker.id)
			this.appFacade.navigateToConversations(conversationId)
		} else {
			this.appFacade.showNotificationMessage(`Error sending initial message for poi: ${marker}`)
		}
	}

	private navigateToMarker(marker: MarkerDto): void {
		this.selectedMarker = marker
		this.appFacade.currentPosition = marker.position
		this.appFacade.navigateToMap(marker.id)

		this.isShowMarkerView = true
	}

	public async syncMarkers(): Promise<void> {
		const currentGeoLocation = this.mapsService.convertLatLngToGeoLocation(this.appFacade.currentPosition)

		try {
			this.markers = (await this.mapsService.getMarkers(currentGeoLocation, Settings.mapRadius, this.markerFilter)) //
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
						title: marker.title,
						description: marker.description,
						distance: (marker.distance.value / 1000).toFixed(1),
						distanceUnit: DistanceUnit.Kilometer,
						type: marker.type,
						id: marker.id
						// shape: { coords: [marker.location.latitude, marker.location.longitude, 1] } as google.maps.MarkerShapeCircle
						// icon: { url: "https://media.tenor.com/images/822fb670841c6f6582fefbb82e338a50/tenor.gif" }
					} as MarkerDto
				})
		} catch (exception) {
			console.info(exception.message)
			this.appFacade.showNotificationMessage(exception.message)
		}
	}

	public onSearchButtonClick(event: MouseEvent): void {
		this.toggleSearchBoxVisibility()
	}

	public async onAddMarkerButtonClick(event: MouseEvent): Promise<void> {
		await this.showAddMarkerView()
	}

	public async onAddMarker(event: CreatePointOfInterestRequest): Promise<void> {
		console.info("onAddMarkerClicked: title=" + event.title)

		const randomLower = -0.0001
		const randomUpper = +0.0001

		event.location = {
			latitude: MathUtil.random(randomLower, randomUpper) + event.location.latitude,
			longitude: MathUtil.random(randomLower, randomUpper) + event.location.longitude
		}

		await this.mapsService.addMarker(event)
		await this.syncMarkers()
	}

	public toggleSearchBoxVisibility(): void {
		this.isSearchBoxVisible = !this.isSearchBoxVisible
	}

	public async showAddMarkerView(this: this): Promise<void> {
		this.isShowAddMarkerView = true
	}

	public onToastClosed(): void {
		// this.notificationMessage = ""
	}
}
