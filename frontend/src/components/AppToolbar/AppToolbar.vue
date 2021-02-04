<template>
	<slot name="menu"></slot>

	<ion-header>
		<ion-toolbar class="main" color="primary">
			<slot name="start" slot="start"></slot>

			<ion-buttons slot="end" class="toolbar-item">
				<slot name="end"></slot>

				<!-- login/logout buttons -->
				<ion-button
					@click="onLoginButtonClick"
					v-if="!authService.isAuthenticated()"
					title="Login"
				>
					<ion-icon
						slot="icon-only"
						:icon="icons.loginIcon"
					></ion-icon>
				</ion-button>
				<ion-button
					@click="onLogoutButtonClick"
					v-if="authService.isAuthenticated()"
					title="Logout"
				>
					<ion-icon
						slot="icon-only"
						:icon="icons.logoutIcon"
					></ion-icon>
				</ion-button>

				<!-- menu button -->
				<ion-menu-button
					@click="onMenuButtonClick"
					auto-hide="false"
				></ion-menu-button>
			</ion-buttons>
		</ion-toolbar>
	</ion-header>
</template>

<script lang="ts" src="./AppToolbar.ts"></script>

<style scoped></style>
