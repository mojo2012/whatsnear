<template>
	<ion-page>
		<ion-header mode="ios" :translucent="true">
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-button @click="onCancelButtonClick">Cancel</ion-button>
				</ion-buttons>

				<ion-title size="middle">
					<ion-segment
						@ionChange="onLoginTypeChanged($event)"
						value="login"
					>
						<ion-segment-button value="login">
							<ion-label>Login</ion-label>
						</ion-segment-button>
						<ion-segment-button value="register">
							<ion-label>Register</ion-label>
						</ion-segment-button>
					</ion-segment>
				</ion-title>

				<ion-buttons slot="end">
					<ion-button
						@click="onSubmitButtonClick"
						:disabled="!isFormFilledOut"
						>Submit</ion-button
					>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>

		<ion-content fullscreen>
			<ion-item>
				<ion-label position="floating">Username</ion-label>
				<ion-input
					tabindex="0"
					v-model="username"
					id="username"
					@keypress="onUsernameInputKeyPress"
					required
					:autofocus="true"
					enterkeyhint="next"
					autocomplete="username"
					min="6"
					maxlength="32"
					:disabled="inputFieldsDisabled"
				></ion-input>
			</ion-item>

			<ion-item>
				<ion-label position="floating">Password</ion-label>
				<ion-input
					tabindex="1"
					type="password"
					v-model="password"
					id="password"
					@keypress="onPasswordInputKeyPress"
					required
					autocomplete="current-password"
					enterkeyhint="send"
					minlength="8"
					maxlength="32"
					:disabled="inputFieldsDisabled"
				></ion-input>

				<!-- <ion-button>
					<ion-icon slot="icon-only" icon-name="eye"></ion-icon>
				</ion-button> -->
			</ion-item>

			<!-- register fields -->
			<ion-item v-if="registerInputFieldsVisible">
				<ion-label position="floating">First name</ion-label>
				<ion-input
					tabindex="2"
					v-model="firstName"
					id="firstName"
					required
					:autofocus="true"
					enterkeyhint="next"
					:disabled="inputFieldsDisabled"
				></ion-input>
			</ion-item>

			<ion-item v-if="registerInputFieldsVisible">
				<ion-label position="floating">Last name</ion-label>
				<ion-input
					tabindex="3"
					v-model="lastName"
					id="lastName"
					required
					:autofocus="true"
					enterkeyhint="next"
					:disabled="inputFieldsDisabled"
				></ion-input>
			</ion-item>

			<!-- loading animation -->
			<ion-spinner
				v-if="isLoading"
				class="loading-spinner"
				name="lines"
			></ion-spinner>

			<slot></slot>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { LoginView } from "./LoginView";
export default LoginView;
</script>

<style>
.loading-spinner {
	margin-left: auto;
	margin-right: auto;
	display: block;
	margin-top: 30px;
	margin-bottom: auto;
}
</style>
