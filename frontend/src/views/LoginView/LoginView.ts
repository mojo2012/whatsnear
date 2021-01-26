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
	IonSegment,
	IonSegmentButton,
	IonSelect,
	IonSelectOption,
	IonSpinner,
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
		IonIcon,
		IonSegment,
		IonSpinner,
		IonSegmentButton
	}
})
export class LoginView extends Vue {
	private authService: AuthService = AuthService.instance
	private modalController: ModalController = modalController
	private router = useRouter()

	private username = ""
	private firstName = ""
	private lastName = ""
	private password = ""

	public inputFieldsDisabled = false
	public registerInputFieldsVisible = false

	public isLoading = false

	public icons = {
		personAdd: personAdd,
		logIn: logIn
	}

	public async mounted(this: this): Promise<void> {
		// const usernameInput: HTMLIonInputElement = document.getElementById("username") as HTMLIonInputElement
		// await (await usernameInput.getInputElement()).focus()
	}

	public onCancelButtonClick(_event: MouseEvent): void {
		console.log("onCancelButtonClick")

		this.modalController.dismiss()
	}

	private resetFormInputFields(): void {
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

	public onLoginTypeChanged(event: { detail: { value: "register" | "login" } }): void {
		const type = event.detail.value

		switch (type) {
			case "register":
				this.registerInputFieldsVisible = true
				break
			case "login":
				this.registerInputFieldsVisible = false
				break
		}
	}

	public setInputFieldsDisabled(state: boolean): void {
		this.inputFieldsDisabled = state
	}

	public async submitLogin(): Promise<void> {
		console.log(this.username + "/" + this.password)
		this.setInputFieldsDisabled(true)

		try {
			await this.authService.authenticate(this.username, this.password)
			this.resetFormInputFields()

			this.$emit("onLoginSuccess")
		} catch (err) {
			console.error("Login failed")
			this.$emit("onLoginFailed")
		}

		this.setInputFieldsDisabled(false)
	}

	public get isFormFilledOut(): boolean {
		return this.username.length > 0 && this.password.length > 0
	}
}
