/* eslint-disable max-classes-per-file */
import { AuthService } from "@/services/AuthService"
import { ModalController } from "@/types/IonicTypes"
import {
	alertController, IonButton,
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
	IonToolbar,
	modalController
} from "@ionic/vue"
import { logIn, personAdd } from 'ionicons/icons'
import { Options, Vue } from "vue-class-component"
import { useRouter } from 'vue-router'

@Options({
	name: "login-view",
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
export class LoginView extends Vue {

	private authService: AuthService = AuthService.instance

	private modalController: ModalController = modalController

	private router = useRouter()

	public icons = {
		personAdd: personAdd,
		logIn: logIn
	}

	public form = {
		username: "",
		password: ""
	}

	public onLoginClicked() {
		console.log("HUHU");
	}

	public onCancelButtonClick(_event: MouseEvent): void {
		console.log("onCancelButtonClick")

		this.modalController.dismiss()
	}

	public async submitLogin(): Promise<void> {
		console.log(this.form.username + "/" + this.form.password);
		this.authService.handleLogin(this.form.username, this.form.password).then(() => {
			this.form.username = ""
			this.form.password = ""
			this.router.push("/tabs/map")
		}).catch(async (err: any) => {
			const errorAlert = await alertController
            .create({
              header: 'Failed',
              subHeader: 'Sign in Failed',
              message: err,
              buttons: ['OK'],
            });
        	await errorAlert.present()
		})
	}
}
