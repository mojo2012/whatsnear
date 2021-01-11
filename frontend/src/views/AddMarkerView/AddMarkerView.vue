<template>
	<ion-page>
		<ion-header mode="ios" :translucent="true">
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-button @click="onCancelButtonClick" >Cancel</ion-button>
				</ion-buttons>

				<ion-title size="middle">New marker</ion-title>

				<ion-buttons slot="end">
					<ion-button @click="onAddButtonClick" color="primary"> Add </ion-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
		<ion-content fullscreen>
			<ion-list lines="full" class="ion-no-margin">
				<GoogleMap
					:api-key="apiKey"
					style="width: 100vw; height: 30vh"
					:center="mapCenter"
					:zoom="13"
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
					<ion-input placeholder="Title" v-model="title" :value="title"></ion-input>
				</ion-item>

				<!-- MARKER TYPE -->
				<ion-item>
					<ion-label>Marker types</ion-label>
					<ion-select placeholder="">
						<ion-label>Marker types</ion-label>
						<ion-select-option
							v-for="(markerType, index) in markerTypes"
							:value="markerType"
							:key="'markerType-' + index"
						>
							{{ markerType }}
						</ion-select-option>
					</ion-select>
				</ion-item>

				<!-- DESCRIPTION -->
				<ion-item>
					<ion-textarea
						:autoGrow="true"
						placeholder="Description"
					></ion-textarea>
				</ion-item>
			</ion-list>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { AddMarkerView } from "./AddMarkerView"
export default AddMarkerView
</script>

<style scope>
/* ion-page, .add-marker-view {
	max-height: 80vh;
	border-radius: 20px;
} */
</style>
