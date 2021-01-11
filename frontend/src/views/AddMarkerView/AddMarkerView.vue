<template>
	<ion-page>
		<ion-header collapse="condense" mode="ios" :translucent="true">
			<ion-toolbar>
				<ion-title size="large">Add new marker</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content fullscreen>
			<ion-list lines="full" class="ion-no-margin">
				<!-- HEADER -->
				<ion-list-header lines="full">
					<ion-label>
						Add new map marker
					</ion-label>
				</ion-list-header>

				<!-- TITLE -->
				<ion-item>
					<ion-input placeholder="Title"></ion-input>
				</ion-item>

				<!-- MARKER TYPE -->
				<ion-item>
					<ion-select>
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

			<ion-list lines="full" class="ion-no-margin">
				<ion-list-header lines="full">
					<ion-label>
						Input Types
					</ion-label>
				</ion-list-header>

				<ion-item>
					<ion-label>Text Input</ion-label>
					<ion-input
						placeholder="placeholder"
						type="text"
					></ion-input>
				</ion-item>

				<ion-item>
					<ion-label>Number Input</ion-label>
					<ion-input
						placeholder="placeholder"
						type="number"
					></ion-input>
				</ion-item>

				<ion-item>
					<ion-label>Password Input</ion-label>
					<ion-input
						placeholder="placeholder"
						type="password"
					></ion-input>
				</ion-item>

				<ion-item>
					<ion-label position="stacked">Multiple Inputs</ion-label>
					<ion-input placeholder="Address Line 1"></ion-input>
					<ion-input placeholder="Address Line 2"></ion-input>
					<ion-input placeholder="City"></ion-input>
					<ion-input placeholder="State"></ion-input>
					<ion-input placeholder="Zip Code"></ion-input>
				</ion-item>

				<ion-item>
					<ion-label position="stacked">Textarea</ion-label>
					<ion-textarea placeholder="placeholder"></ion-textarea>
				</ion-item>
			</ion-list>
		</ion-content>
	</ion-page>
</template>

<script lang="ts" src="./AddMarkerView.ts"></script>

<style scope>
/* ion-page, .add-marker-view {
	max-height: 80vh;
	border-radius: 20px;
} */
</style>
