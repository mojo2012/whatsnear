/* eslint-disable max-classes-per-file */
import AppToolbar from "@/components/AppToolbar/AppToolbar.vue"
import ChatBubble from "@/components/ChatBubble/ChatBubble.vue"
import { POINT_OF_SERVICE_MAPPING } from "@/configuration/Mappings"
import { Conversation } from "@/dtos/Conversation"
import { Message } from "@/dtos/Message"
import { AppFacade } from "@/facades/AppFacade"
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
	IonNav,
	IonPage,
	IonRouterOutlet,
	IonSearchbar,
	IonSelect,
	IonSelectOption,
	IonSplitPane,
	IonTextarea,
	IonTitle,
	IonToolbar
} from "@ionic/vue"
import { add, alertCircleOutline, close, key, logOut, navigate, search, sendSharp } from "ionicons/icons"
import { Options, Vue } from "vue-class-component"

@Options({
	name: "conversation-view",
	components: {
		IonHeader,
		IonToolbar,
		IonRouterOutlet,
		IonNav,
		IonMenu,
		IonTitle,
		IonList,
		IonSplitPane,
		IonItem,
		IonButton,
		IonButtons,
		IonLabel,
		IonSearchbar,
		IonContent,
		IonInput,
		IonTextarea,
		IonSelect,
		IonSelectOption,
		IonPage,
		IonIcon,
		AppToolbar,
		ChatBubble
	}
})
export class ConversationsView extends Vue {
	private appFacade = AppFacade.instance
	private authService = AuthService.instance
	private messageService = MessageService.instance

	private allConversations: Conversation[] = []
	public filterText = ""
	public selectedConversation!: Conversation
	public messagesOfSelectedConversation: Message[] = []
	public selectedConversationId = ""
	public currentUsername = ""
	public newMessage = ""

	// icons
	public icons = {
		addIcon: add,
		searchIcon: search,
		closeIcon: close,
		navigateIcon: navigate,
		loginIcon: key,
		logoutIcon: logOut,
		alertCircle: alertCircleOutline,
		sendIcon: sendSharp
	}

	public async created(): Promise<void> {
		//
	}

	public async beforeMount(): Promise<void> {
		this.currentUsername = (await this.authService.getCurrentUsername()) ?? ""
	}

	public async mounted(this: this): Promise<void> {
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

	public updateConversationId(): void {
		const conversationId = this.$route?.params["conversationId"]
		const selectedConversationId =
			conversationId instanceof Array //
				? (conversationId[0] as string)
				: (conversationId as string)

		this.selectedConversationId = selectedConversationId
	}

	public async fetchMessagesForSelectedConversation(): Promise<void> {
		let messages: Message[]
		if (this.selectedConversationId) {
			messages = await this.messageService.getMessages(this.selectedConversationId)
		} else {
			messages = []
		}

		this.messagesOfSelectedConversation = messages
	}

	public async beforeUpdate(this: this): Promise<void> {
		try {
			const conversations = await this.messageService.getConversations()
			this.allConversations = conversations
			this.updateConversationId()

			await this.fetchMessagesForSelectedConversation()
		} catch (exception) {
			this.appFacade.showNotificationMessage("Cannot get conversations from backend.")
		}
	}

	public get conversations(): Conversation[] {
		return this.filterText
			? this.allConversations.filter((c) => c.poi.title.includes(this.filterText)) //
			: this.allConversations
	}

	public getPoiIcon(code: string): string {
		return POINT_OF_SERVICE_MAPPING.filter((p) => p.code === code).map((p) => p.icon)[0]
	}

	public onSearchBarInput(event: InputEvent): void {
		this.filterText = (event.data as string) ?? ""
	}

	public async onConversationSelected(event: MouseEvent, conversationId: string): Promise<void> {
		this.appFacade.navigateToConversations(conversationId)
		this.selectedConversationId = conversationId
		await this.fetchMessagesForSelectedConversation()
	}

	public async onSendButtonClick(event: unknown): Promise<void> {
		console.log("send")

		const newMessage = await this.messageService.sendMessage(this.selectedConversationId, this.newMessage)
		this.messagesOfSelectedConversation.push(newMessage)

		this.newMessage = ""
	}
}
