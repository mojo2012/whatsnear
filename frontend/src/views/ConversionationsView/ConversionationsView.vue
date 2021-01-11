<template>
	<ion-page>
		<ion-header collapse="condense">
			<ion-toolbar>
				<ion-title size="large">Tab 2</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<ExploreContainer name="Tab 2 page" />
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
	name: "Tab2",
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
