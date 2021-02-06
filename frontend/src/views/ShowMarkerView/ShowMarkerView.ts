/* eslint-disable max-classes-per-file */
import { PointOfServiceTypeIconMappingType, POINT_OF_SERVICE_MAPPING } from "@/configuration/Mappings"
import { Settings } from "@/configuration/Settings"
import { MarkerDto } from "@/dtos/MarkerDto"
import { AppFacade } from "@/facades/AppFacade"
import { MessageService } from "@/services/MessageService"
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
	emits: ["onCreateConversation"],
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
	private messageService = MessageService.instance
	private appFacade = AppFacade.instance

	public apiKey = Settings.googleApiKey

	public mounted(): void {
		console.info("mounted")
	}

	public onCancelButtonClick(_event: MouseEvent): void {
		console.info("onCancelButtonClick")

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

	public get markerType(): string {
		// const code = this.markerTypes
		// 	.filter((t) => t.code === this.marker.type) //
		// 	.map((t) => t.icon)
		// const ret = `${this.marker.type} ${code}`

		return this.marker.type
	}

	public get markerTypes(): PointOfServiceTypeIconMappingType[] {
		return POINT_OF_SERVICE_MAPPING
	}

	public async onContactButtonClick(event: unknown): Promise<void> {
		if (this._marker.id) {
			// const top = await this.modalController.getTop()
			// this.modalController.dismiss(null, "", top?.id)
			// this.appFacade.navigateToConversations(conversationId)

			this.$emit("onCreateConversation", this.marker)

			// this.appFacade.showNotificationMessage(`Send initial message for poi: ${this._marker.title}`)
		} else {
			this.appFacade.showNotificationMessage(`Error sending initial message for poi: ${this._marker.title}`)
		}
	}
}
