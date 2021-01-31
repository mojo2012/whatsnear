/* eslint-disable max-classes-per-file */
import { Conversation } from "@/dtos/Conversation"
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
	IonPage,
	IonSelect,
	IonSelectOption,
	IonTextarea,
	IonTitle,
	IonToolbar
} from "@ionic/vue"
import { Options, Vue } from "vue-class-component"

@Options({
	name: "conversation-view",
	components: {
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
		IonPage,
		IonIcon
	}
})
export class ConversationsView extends Vue {
	private messageService = MessageService.instance
	public conversations: Conversation[] = []

	public async created(): Promise<void> {
		const conversations = await this.messageService.getConversations()

		this.conversations = conversations

		// this.conversations.push({
		// 	poi: { id: "aaa", type: PointOfServiceType.GIVE_AWAY }
		// })
	}
}
