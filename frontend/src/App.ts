import { AppFacade } from "@/facades/AppFacade"
import LoginView from "@/views/LoginView/LoginView.vue"
import { IonApp, IonIcon, IonModal, IonRouterOutlet } from "@ionic/vue"
import { Options, Vue } from "vue-class-component"

@Options({
	name: "App",
	components: {
		IonApp,
		IonRouterOutlet,
		IonModal,
		IonIcon,
		LoginView
	}
})
export default class App extends Vue {
	public appFacade = AppFacade.instance

	public async created(): Promise<void> {
		// await this.appFacade.initAuthService()
	}
}
