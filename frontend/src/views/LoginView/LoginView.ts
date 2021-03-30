/* eslint-disable max-classes-per-file */
import { UserData } from "@/dtos/UserData"
import { AppFacade } from "@/facades/AppFacade"
import { AuthService } from "@/services/AuthService"
import { RegisterOrLoginType } from "@/types/helper-types"
import { ModalController } from "@/types/IonicTypes"
import { tryAndLog } from "@/utils/MiscUtil"
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
import { alertCircle, logIn, personAdd } from "ionicons/icons"
import { Options, prop, Vue } from "vue-class-component"
class Props {
	public onBeforeLogin = prop({
		type: Function,
		required: false
	})
	public onLoginDismiss = prop({
		type: Function,
		required: false
	})
	public onLoginSuccess = prop({
		type: Function,
		required: false
	})
	public onLoginFailed = prop({
		type: Function,
		required: false
	})
}

@Options({
	name: "login-view",
	emits: ["onBeforeLogin", "onLoginFailed", "onLoginSuccess"],
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
export class LoginView extends Vue.with(Props) {
	private authService: AuthService = AuthService.instance
	private modalController: ModalController = modalController
	public appFacade = AppFacade.instance

	private username = ""
	private firstName = ""
	private lastName = ""
	private password = ""

	public inputFieldsDisabled = false
	public registerOrLogin: RegisterOrLoginType = "login"

	public isLoading = false

	public icons = {
		personAdd: personAdd,
		logIn: logIn,
		alertCircle: alertCircle
	}

	public async mounted(this: this): Promise<void> {
		//
	}

	public onCancelButtonClick(_event: MouseEvent): void {
		console.info("onCancelButtonClick")

		this.modalController.dismiss()
	}

	private resetFormInputFields(): void {
		this.username = ""
		this.password = ""
		this.firstName = ""
		this.lastName = ""
	}

	public async onSubmitButtonClick(): Promise<void> {
		await this.submitForm()
	}

	public async onInputFieldKeyPress(event: KeyboardEvent): Promise<void> {
		if (event.code === "Enter" || event.code === "NumpadEnter") {
			if (this.validateForm()) {
				await this.submitForm()
			} else {
				// const currentInput = event.target as HTMLIonInputElement
				// const passwordInput: HTMLIonInputElement = document.getElementById("password") as HTMLIonInputElement
				// await passwordInput.setFocus()
				// this.focusInputField(currentInput.tabIndex + 1)
			}
		}
	}

	private focusInputField(tabIndex: number): void {
		const formFields = this.getFormFields()

		if (formFields.length < tabIndex) {
			const nextFormField = formFields.filter((field) => field.tabIndex === tabIndex)[0]
			nextFormField?.focus()
		}
	}

	private validateForm(): boolean {
		// TODO improve and validate in real
		// const formFields = this.getFormFields()
		// const validFormFields = formFields //
		// 	.filter((field) => (field?.value?.toString()?.length ?? 0) > 0)

		// return validFormFields.length == formFields.length

		let ret = false

		if (this.username.length > 0 && this.password.length > 0) {
			if (this.isTypeRegister) {
				if (this.firstName.length > 0 && this.lastName.length > 0 && this.username.length > 0 && this.password.length > 0) {
					ret = true
				}
			} else {
				ret = true
			}
		}

		return ret
	}

	private getFormFields(): HTMLIonInputElement[] {
		const inputFields = document.querySelectorAll("ion-input.form-field")
		const mappedInputFields = []

		for (const item of inputFields) {
			mappedInputFields.push(item as HTMLIonInputElement)
		}

		return mappedInputFields
	}

	public onLoginTypeChanged(event: { detail: { value: RegisterOrLoginType } }): void {
		this.registerOrLogin = event.detail.value
	}

	public get isTypeRegister(): boolean {
		switch (this.registerOrLogin) {
			case "register":
				return true
			case "login":
				return false
			default:
				return false
		}
	}

	public setInputFieldsDisabled(state: boolean): void {
		this.inputFieldsDisabled = state
	}

	public async submitForm(): Promise<void> {
		console.info(this.username + "/" + this.password)

		this.$emit("onBeforeLogin")
		tryAndLog(this.onBeforeLogin, null)

		this.setInputFieldsDisabled(true)
		this.isLoading = true

		try {
			if (this.isTypeRegister) {
				const registration: UserData = {
					id: null,
					username: this.username,
					password: this.password,
					firstname: this.firstName,
					lastname: this.lastName
				}
				await this.authService.register(registration)
			} else {
				await this.authService.authenticate(this.username, this.password)
			}

			this.resetFormInputFields()

			this.$emit("onLoginSuccess", this.registerOrLogin)
			tryAndLog(this.onLoginSuccess, null, this.registerOrLogin)
		} catch (err) {
			console.error("Login failed")
			this.$emit("onLoginFailed", this.registerOrLogin)
			tryAndLog(this.onLoginFailed, null, this.registerOrLogin)
		}

		this.isLoading = false
		this.setInputFieldsDisabled(false)
	}

	public get isFormFilledOut(): boolean {
		return this.username.length > 0 && this.password.length > 0
	}
}
