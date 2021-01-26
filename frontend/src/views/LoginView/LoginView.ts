/* eslint-disable max-classes-per-file */
import { AuthService } from "@/services/AuthService"
import { ModalController } from "@/types/IonicTypes"
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
	IonToolbar,
	modalController
} from "@ionic/vue"
import { logIn, personAdd } from "ionicons/icons"
import { Options, Vue } from "vue-class-component"
import { useRouter } from "vue-router"

@Options({
	name: "login-view",
	emits: ["onLoginFailed", "onLoginSuccess"],
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

	private username = ""
	private password = ""

	public icons = {
		personAdd: personAdd,
		logIn: logIn
	}

	public onCancelButtonClick(_event: MouseEvent): void {
		console.log("onCancelButtonClick")

		this.modalController.dismiss()
	}

	private resetForm(): void {
		this.username = ""
		this.password = ""
	}

	public async onSubmitButtonClick(): Promise<void> {
		await this.submitLogin()
	}

	public async onUsernameInputKeyPress(event: KeyboardEvent): Promise<void> {
		if (event.code === "Enter" || event.code === "NumpadEnter") {
			const passwordInput: HTMLIonInputElement = document.getElementById("password") as HTMLIonInputElement
			await passwordInput.setFocus()
		}
	}

	public async onPasswordInputKeyPress(event: KeyboardEvent): Promise<void> {
		if (event.code === "Enter" || event.code === "NumpadEnter") {
			await this.submitLogin()
		}
	}

	public async submitLogin(): Promise<void> {
		console.log(this.username + "/" + this.password)
		try {
			await this.authService.authenticate(this.username, this.password)
			this.resetForm()
			this.modalController.dismiss()

			this.$emit("onLoginSuccess")
		} catch (err) {
			this.$emit("onLoginFailed")
		}
	}

	public get isFormFilledOut(): boolean {
		return this.username.length > 0 && this.password.length > 0
	}
}
