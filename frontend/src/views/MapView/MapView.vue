<template>
	<ion-page>
		<app-toolbar>
			<template v-slot:menu-left>
				<ion-content>
					<ion-list>
						<ion-item
							v-for="(marker, index) in markers"
							:key="'markerListItem-' + index"
							button
							@click="onMarkerSelected($event, marker)"
						>
							<ion-label
								>{{ marker.label }} {{ marker.title }} ({{
									marker.distance
								}}
								{{ marker.distanceUnit }})</ion-label
							>
						</ion-item>
					</ion-list>
				</ion-content>
			</template>

			<template v-slot:start>
				<ion-searchbar
					debounce="1000"
					animated
					mode="ios"
					class="toolbar-item"
					@input="onSearchBarInput"
					placeholder="Filter ..."
				></ion-searchbar>
			</template>

			<template v-slot:end>
				<ion-button
					@click="onAddMarkerButtonClick"
					v-if="authService.isAuthenticated()"
					title="Add marker"
				>
					<ion-icon slot="icon-only" :icon="icons.addIcon"></ion-icon>
				</ion-button>
				<ion-button @click="onLocateMeButtonClick" title="Locate me">
					<ion-icon
						slot="icon-only"
						:icon="icons.navigateIcon"
					></ion-icon>
				</ion-button>
			</template>
		</app-toolbar>

		<ion-content id="main-content" :fullscreen="true">
			<GoogleMap
				:api-key="apiKey"
				style="width: 100%; height: 100%"
				:center="appFacade.currentPosition"
				:zoom="10"
			>
				<!-- current position -->
				<Marker :options="currentPositionMarker" />

				<!-- marker -->
				<Marker
					v-for="(marker, index) in markers"
					:key="index"
					:options="marker"
					@click="onMarkerSelected($event, marker)"
				/>
			</GoogleMap>
		</ion-content>

		<ion-modal
			key="add-marker-dialog"
			mode="ios"
			:swipe-to-close="true"
			:is-open="isShowAddMarkerView"
			css-class="add-marker-view"
			@onDidDismiss="isShowAddMarkerView = false"
		>
			<add-marker-view
				:mapLat="appFacade.currentPosition.lat"
				:mapLon="appFacade.currentPosition.lng"
				@onAddMarker="onAddMarker"
			></add-marker-view>
		</ion-modal>

		<ion-modal
			key="show-marker-dialog"
			mode="ios"
			:swipe-to-close="true"
			:is-open="isShowMarkerView"
			css-class="show-marker-view"
			@onDidDismiss="isShowMarkerView = false"
		>
			<show-marker-view :marker="selectedMarker"></show-marker-view>
		</ion-modal>
	</ion-page>
</template>

<script lang="ts">
import { MapView } from "./MapView";
export default MapView;
</script>

<style scoped></style>
