<template>
	<ion-page>
		<ion-header mode="ios" :translucent="true">
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-button @click="onCancelButtonClick">Cancel</ion-button>
				</ion-buttons>

				<ion-title size="middle">Login</ion-title>
			</ion-toolbar>
		</ion-header>

		<form @submit.prevent="submitLogin">
			<ion-card>
				<ion-item>
					<ion-label position="floating">Username</ion-label>
					<ion-input v-model="form.username" id="username" required></ion-input>
				</ion-item>

				<ion-item>
					<ion-label position="floating">Password</ion-label>
					<ion-input type="password" v-model="form.password" id="password" required></ion-input>
				</ion-item>

				<ion-item>
					<ion-button type="submit" shape="round">
						Sign In
						<ion-icon slot="end" :icon="icons.logIn"></ion-icon>
					</ion-button>
				</ion-item>
				<ion-item>
					<p>Or</p>
				</ion-item>
				<ion-item>
					<ion-button type="button" shape="round" router-link="/signup">
						Sign Up
						<ion-icon slot="end" :icon="icons.personAdd"></ion-icon>
					</ion-button>
				</ion-item>
			</ion-card>
		</form>
	</ion-page>
</template>

<script lang="ts">
	import { LoginView } from "./LoginView";
	export default LoginView;
</script>
