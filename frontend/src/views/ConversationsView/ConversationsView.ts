/* eslint-disable max-classes-per-file */
import AppToolbar from "@/components/AppToolbar/AppToolbar.vue"
import { PointOfServiceTypeIconMappingType, POINT_OF_SERVICE_MAPPING } from "@/configuration/Mappings"
import { Conversation } from "@/dtos/Conversation"
import { AuthService } from "@/services/AuthService"
import { MessageService } from "@/services/MessageService"
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
	IonPage,
	IonSelect,
	IonSelectOption,
	IonTextarea,
	IonTitle,
	IonToolbar
} from "@ionic/vue"
import { add, alertCircleOutline, close, key, logOut, navigate, search } from "ionicons/icons"
import { Options, Vue } from "vue-class-component"

@Options({
	name: "conversation-view",
	components: {
		IonHeader,
		IonToolbar,
		IonMenu,
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
		IonIcon,
		AppToolbar
	}
})
export class ConversationsView extends Vue {
	public authService = AuthService.instance
	private messageService = MessageService.instance
	public conversations: Conversation[] = []

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
		// await this.authService.loadStoredAuthentication()
	}

	public async mounted(this: this): Promise<void> {
		const conversations = await this.messageService.getConversations()
		this.conversations = conversations
		// this.conversations.push({
		// 	poi: {
		// 		id: "aaa",
		// 		type: PointOfServiceType.GIVE_AWAY,
		// 		author: "me",
		// 		description: "test",
		// 		location: { latitude: 49, longitude: 16 },
		// 		distance: { unit: DistanceUnit.Kilometer, value: 20 },
		// 		title: "title",
		// 		validTo: new Date()
		// 	}
		// })
	}

	public get markerTypes(): PointOfServiceTypeIconMappingType[] {
		return POINT_OF_SERVICE_MAPPING
	}
}
