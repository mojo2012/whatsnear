<template>
	<ion-page>
		<ion-header mode="ios" :translucent="true">
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-button @click="onCancelButtonClick">Cancel</ion-button>
				</ion-buttons>

				<ion-title size="middle">New marker</ion-title>

				<ion-buttons slot="end">
					<ion-button @click="onAddButtonClick" color="primary">
						Add
					</ion-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
		<ion-content fullscreen>
			<ion-list lines="full" class="ion-no-margin">
				<GoogleMap
					class="map"
					:api-key="apiKey"
					:center="mapCenter"
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
					<Marker :options="{ position: mapCenter }" />
				</GoogleMap>

				<!-- HEADER -->
				<!-- <ion-list-header lines="full">
					<ion-label> Add new map marker </ion-label>
				</ion-list-header> -->

				<!-- TITLE -->
				<ion-item>
					<ion-input
						placeholder="Title"
						v-model="title"
						:value="title"
					></ion-input>
				</ion-item>

				<!-- MARKER TYPE -->
				<ion-item>
					<ion-label>Marker types</ion-label>

					<ion-select
						placeholder=""
						:value="markerType"
						@ionChange="onMarkerTypeChanged"
					>
						<ion-label>Marker types</ion-label>
						<ion-select-option
							v-for="mk in markerTypes"
							:value="mk.code"
						>
							{{ mk.icon }} {{ mk.code }}
						</ion-select-option>
					</ion-select>
				</ion-item>

				<!-- DESCRIPTION -->
				<ion-item>
					<ion-textarea
						:autoGrow="true"
						placeholder="Description"
						v-model="description"
						:value="description"
					></ion-textarea>
				</ion-item>
			</ion-list>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { AddMarkerView } from "./AddMarkerView";
export default AddMarkerView;
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
