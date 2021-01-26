<template>
	<ion-page>
		<ion-header mode="ios" :translucent="true">
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-button @click="onCancelButtonClick">Cancel</ion-button>
				</ion-buttons>

				<ion-title size="middle">Login</ion-title>

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
					v-model="username"
					id="username"
					@keypress="onUsernameInputKeyPress"
					required
					:autofocus="true"
					enterkeyhint="next"
					autocomplete="username"
					min="6"
					maxlength="32"
					:disabled="usernameInputDisabled"
				></ion-input>
			</ion-item>

			<ion-item>
				<ion-label position="floating">Password</ion-label>
				<ion-input
					type="password"
					v-model="password"
					id="password"
					@keypress="onPasswordInputKeyPress"
					required
					autocomplete="current-password"
					enterkeyhint="send"
					minlength="8"
					maxlength="32"
					:disabled="passwordInputDisabled"
				></ion-input>
			</ion-item>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { LoginView } from "./LoginView";
export default LoginView;
</script>
