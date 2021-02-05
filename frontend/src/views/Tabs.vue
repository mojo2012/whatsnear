<template>
	<ion-page>
		<ion-tabs v-if="true">
			<ion-tab-bar slot="bottom">
				<ion-tab-button tab="map" href="/tabs/map" v-if="true">
					<ion-icon :icon="map" />
					<ion-label>Map</ion-label>
				</ion-tab-button>

				<ion-tab-button
					tab="conversations"
					href="/tabs/conversations"
					v-if="true"
				>
					<ion-icon :icon="chatbubbles" />
					<ion-label>Conversations</ion-label>
				</ion-tab-button>

				<ion-tab-button
					tab="settings"
					href="/tabs/settings"
					v-if="true"
				>
					<ion-icon :icon="settings" />
					<ion-label>Settings</ion-label>
				</ion-tab-button>
			</ion-tab-bar>
		</ion-tabs>
	</ion-page>
</template>

<script lang="ts">
import {
	IonTabBar,
	IonTabButton,
	IonTabs,
	IonLabel,
	IonIcon,
	IonPage,
} from "@ionic/vue";
import { map, chatbubbles, settings } from "ionicons/icons";

export default {
	name: "Tabs",
	components: {
		IonLabel,
		IonTabs,
		IonTabBar,
		IonTabButton,
		IonIcon,
		IonPage,
	},
	setup() {
		return {
			map,
			chatbubbles,
			settings,
		};
	},
};
</script>
