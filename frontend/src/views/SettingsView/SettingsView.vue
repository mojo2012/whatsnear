<template>
	<ion-page>
		<ion-page>
			<ion-header collapse="condense" mode="ios" :translucent="true">
				<ion-toolbar>
					<ion-title size="large">Tab 3</ion-title>
				</ion-toolbar>
			</ion-header>
			<ion-content :fullscreen="true">
				<ExploreContainer name="Tab 3 page" />
			</ion-content>
		</ion-page>
		<ion-content :fullscreen="true">
			<ExploreContainer name="Tab 3 page" />
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent
} from "@ionic/vue";
import ExploreContainer from "@/components/ExploreContainer.vue";

export default {
	name: "settings",
	components: {
		ExploreContainer,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		IonPage
	}
};
</script>
