import { AuthService } from "@/services/AuthService"
import { IonIcon, IonLabel, IonPage, IonTabBar, IonTabButton, IonTabs } from "@ionic/vue"
import { chatbubbles, map, settings } from "ionicons/icons"
import { Options, Vue } from "vue-class-component"

@Options({
	name: "Tabs",
	components: {
		IonLabel,
		IonTabs,
		IonTabBar,
		IonTabButton,
		IonIcon,
		IonPage
	}
})
export default class TabsView extends Vue {
	public authService = AuthService.instance

	public icons = {
		map,
		chatbubbles,
		settings
	}
}
