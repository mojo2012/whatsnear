<template>
	<ion-header mode="ios" :translucent="true">
		<ion-toolbar>
			<ion-buttons slot="start">
				<ion-button @click="onCancelButtonClick">Cancel</ion-button>
			</ion-buttons>

			<ion-title size="middle">
				<ion-segment
					@ionChange="onLoginTypeChanged($event)"
					:disabled="inputFieldsDisabled"
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
					v-show="!isLoading"
					@click="onSubmitButtonClick"
					:disabled="!isFormFilledOut"
					>Submit</ion-button
				>
				<!-- loading animation -->
				<ion-spinner
					v-show="isLoading"
					class="loading-spinner"
					name="lines"
				></ion-spinner>
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
				class="form-field"
				@keypress="onInputFieldKeyPress"
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
				class="form-field"
				@keypress="onInputFieldKeyPress"
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
		<ion-item v-if="isTypeRegister">
			<ion-label position="floating">First name</ion-label>
			<ion-input
				tabindex="2"
				v-model="firstName"
				id="firstName"
				class="form-field"
				@keypress="onInputFieldKeyPress"
				required
				:autofocus="true"
				enterkeyhint="next"
				:disabled="inputFieldsDisabled"
			></ion-input>
		</ion-item>

		<ion-item v-if="isTypeRegister">
			<ion-label position="floating">Last name</ion-label>
			<ion-input
				tabindex="3"
				v-model="lastName"
				id="lastName"
				class="form-field"
				@keypress="onInputFieldKeyPress"
				required
				:autofocus="true"
				enterkeyhint="next"
				:disabled="inputFieldsDisabled"
			></ion-input>
		</ion-item>

		<div
			class="login-error-message"
			v-if="appFacade.loginErrorMessage?.length > 0"
		>
			<ion-icon :icon="icons.alertCircle" />
			<span>{{ appFacade.loginErrorMessage }}</span>
		</div>

		<slot></slot>
	</ion-content>
</template>

<script lang="ts">
import { LoginView } from "./LoginView";
export default LoginView;
</script>

<style>
/* .loading-spinner {
	margin-left: auto;
	margin-right: auto;
	display: block;
	margin-top: 30px;
	margin-bottom: auto;
} */
</style>
