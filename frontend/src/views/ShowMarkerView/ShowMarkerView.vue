<template>
	<ion-page>
		<ion-header mode="ios" :translucent="true">
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-button @click="onCancelButtonClick">Cancel</ion-button>
				</ion-buttons>

				<ion-title size="middle">{{marker.title}}</ion-title>

				<ion-buttons slot="end">
					<ion-button @click="onContactButtonClick" color="primary">
						Contact
					</ion-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
		<ion-content fullscreen>
			<ion-list lines="full" class="ion-no-margin">
				<GoogleMap
					class="map"
					:api-key="apiKey"
					:center="marker.position"
					:zoom="15"
					:zoomControl="false"
					:disableDefaultUi="true"
					:disableDoubleClickZoom="true"
					:fullscreenControl="false"
					:panControl="false"
					gestureHandling="none"
					:draggable="false"
					:clickableIcons="false"
					:keyboardShortcuts="false"
					:mapTypeControl="false"
					:rotateControl="false"
					:scaleControl="false"
				>
					<!-- current position -->
					<Marker :options="marker" />
				</GoogleMap>

				<!-- HEADER -->
				<!-- <ion-list-header lines="full">
					<ion-label> Add new map marker </ion-label>
				</ion-list-header> -->

				<!-- TITLE -->
				<ion-item>
					<ion-input
						readonly
						placeholder="Title"
						:value="marker.title"
					></ion-input>
				</ion-item>

				<!-- MARKER TYPE -->
				<ion-item>
					<ion-input
						readonly
						placeholder="Type"
						:value="markerType"
					></ion-input>
				</ion-item>

				<!-- DESCRIPTION -->
				<ion-item>
					<ion-textarea
						readonly
						:autoGrow="true"
						:value="marker.description"
					></ion-textarea>
				</ion-item>
			</ion-list>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { ShowMarkerView } from "./ShowMarkerView";
export default ShowMarkerView;
</script>

<style scope>
/* ion-page, .add-marker-view {
	max-height: 80vh;
	border-radius: 20px;
} */

.map {
	width: 100%;
	height: 30vh;
	max-height: 270px;
}
</style>
