<template>
	<ion-page>
		<ion-header>
			<ion-toolbar class="main" color="primary">
				<ion-title size="large">Settings</ion-title>
				<ion-buttons slot="end" class="toolbar-item">
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
					<ion-menu-button auto-hide="false"></ion-menu-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true">
			<ion-list>
				<ion-item-group>
					<ion-list-header>
						<ion-label>General</ion-label>
					</ion-list-header>
					<ion-item>
						<ion-label>Max. radius</ion-label>
						<ion-select placeholder="" :value="maxRadius">
							<ion-label>Max radius</ion-label>
							<ion-select-option
								v-for="step in radiusEntries"
								:value="step"
							>
								{{ step }} km
							</ion-select-option>
						</ion-select>
					</ion-item>
				</ion-item-group>

				<ion-item-divider><ion-label></ion-label> </ion-item-divider>

				<ion-item-group>
					<ion-list-header>
						<ion-label>Notifications</ion-label>
					</ion-list-header>
					<ion-item>
						<ion-label>New marker within radius</ion-label>
						<ion-toggle
							value="notifyAboutNewMarkers"
							:checked="notifyAboutNewMarkers"
							mode="ios"
						>
						</ion-toggle>
					</ion-item>
				</ion-item-group>
			</ion-list>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { SettingsView } from "./SettingsView";
export default SettingsView;
</script>

<style>
/* ion-list {
	max-width: 90vw;
	max-height: 90vh;
	margin: auto;
} */
</style>
