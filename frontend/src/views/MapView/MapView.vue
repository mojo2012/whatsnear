<template>
	<ion-page>
		<ion-menu side="start" type="reveal" content-id="main-content">
			<ion-header>
				<ion-toolbar translucent>
					<ion-title>Menu</ion-title>
				</ion-toolbar>
			</ion-header>
			<ion-content>
				<ion-list>
					<ion-item
						v-for="(marker, index) in markers"
						:key="'markerListItem-' + index"
						button
						@click="onMarkerSelected($event, marker)"
					>
						<!-- <ion-icon :name="marker.label" slot="start"></ion-icon> -->
						<!-- <ion-label>{{marker.label}}</ion-label> -->
						<ion-label
							>{{ marker.label }} {{ marker.title }} ({{
								marker.distance
							}}
							{{ marker.distanceUnit }})</ion-label
						>
					</ion-item>
				</ion-list>
			</ion-content>
		</ion-menu>

		<ion-header>
			<ion-toolbar>
				<ion-input
					id="addInputBox"
					clear-input
					placeholder="I'm looking for ..."
					type="search"
				></ion-input>
				<!-- <ion-searchbar
					placeholder="I'm looking for ..."
				></ion-searchbar> -->

				<ion-buttons slot="end">
					<ion-button @click="onAddMarkerButtonClick">
						<ion-icon
							slot="icon-only"
							:icon="icons.addIcon"
						></ion-icon>
					</ion-button>
					<ion-button @click="onLocateMeButtonClick">
						<ion-icon
							slot="icon-only"
							:icon="icons.navigateIcon"
						></ion-icon>
					</ion-button>
					<ion-button @mouseup="onSearchButtonClick">
						<ion-icon
							slot="icon-only"
							:icon="icons.searchIcon"
						></ion-icon>
					</ion-button>
					<ion-menu-button
						@click="onMenuButtonClick"
						auto-hide="false"
					></ion-menu-button>
				</ion-buttons>
			</ion-toolbar>
			<ion-toolbar v-if="isSearchBoxVisible">
				<ion-searchbar
					debounce="500"
					animated
					@input="onSearchBarInput"
					placeholder="Filter ..."
				></ion-searchbar>
			</ion-toolbar>
		</ion-header>
		<ion-content id="main-content" :fullscreen="true">
			<GoogleMap
				:api-key="apiKey"
				style="width: 100vw; height: 100vh"
				:center="mapCenter"
				:zoom="10"
			>
				<!-- current position -->
				<Marker :options="{ position: mapCenter }" />

				<!-- marker -->
				<Marker
					v-for="(marker, index) in markers"
					:key="index"
					:options="marker"
					@click="onMarkerSelected"
				/>
			</GoogleMap>
		</ion-content>

		<ion-modal
			mode="ios"
			:swipe-to-close="true"
			:is-open="isShowAddMarkerView"
			css-class="add-marker-view"
			@onDidDismiss="isShowAddMarkerView = false"
		>
			<add-marker-view
				:mapLat="mapCenter.lat"
				:mapLon="mapCenter.lng"
				@onAddMarker="onAddMarkerClicked"
			></add-marker-view>
		</ion-modal>
	</ion-page>
</template>

<script lang="ts">
import { MapView } from "./MapView";
export default MapView;
</script>

<style scoped>
ion-input#addInputBox {
	margin-left: 10px;
}
</style>
<style>
.add-marker-view > .modal-wrapper {
	margin-top: 10px;
	border-radius: 20px;
	width: 98vw;
	max-width: 500px;
}
</style>
