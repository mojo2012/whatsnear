<template>
	<ion-page>
		<ion-tabs >
			<ion-tab-bar slot="bottom" v-if="authService.isAuthenticated()">
				<ion-tab-button tab="map" href="/tabs/map" v-if="true">
					<ion-icon :icon="icons.map" />
					<ion-label>Map</ion-label>
				</ion-tab-button>

				<ion-tab-button
					tab="conversations"
					href="/tabs/conversations"
					v-if="true"
				>
					<ion-icon :icon="icons.chatbubbles" />
					<ion-label>Conversations</ion-label>
				</ion-tab-button>

				<ion-tab-button
					tab="settings"
					href="/tabs/settings"
					v-if="true"
				>
					<ion-icon :icon="icons.settings" />
					<ion-label>Settings</ion-label>
				</ion-tab-button>
			</ion-tab-bar>
		</ion-tabs>
	</ion-page>
</template>

<script lang="ts" src="./TabsView.ts"></script>
