<template>
	<ion-page>
		<app-toolbar
			menu-position="end"
			menu-id="settings-menu"
			content-id="settings-content"
		/>

		<ion-content id="settings-content" :fullscreen="true">
			<ion-list>
				<ion-item-group>
					<ion-list-header>
						<ion-label>General</ion-label>
					</ion-list-header>
					<ion-item>
						<ion-label>Max. radius</ion-label>
						<ion-select
							placeholder=""
							v-model="maxDistance"
							@ionChange="onMaxDistanceChanged"
						>
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
						<ion-label
							>Notifications
							{{ notifyAboutNewMarkers }}</ion-label
						>
					</ion-list-header>
					<ion-item>
						<ion-label>New marker within radius</ion-label>
						<ion-toggle
							v-model="notifyAboutNewMarkers"
							:checked="notifyAboutNewMarkers"
							@ionChange="onNotifyAboutNewMarkersChanged"
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

<style></style>
