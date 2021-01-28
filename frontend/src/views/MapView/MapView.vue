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
				<ion-searchbar
					debounce="1000"
					animated
					mode="ios"
					class="toolbar-item"
					@input="onSearchBarInput"
					placeholder="Filter ..."
				></ion-searchbar>

				<!-- <ion-input
					type="search"
					:clearInput="true"
					:debounce="true"
					inputmode="search"
					placeholder="Search ..."
					@input="onSearchBarInput"
				>
				</ion-input> -->

				<ion-buttons slot="end" class="toolbar-item">
					<ion-button
						@click="onAddMarkerButtonClick"
						v-if="authService.isAuthenticated()"
						title="Add marker"
					>
						<ion-icon
							slot="icon-only"
							:icon="icons.addIcon"
						></ion-icon>
					</ion-button>
					<ion-button @click="onLocateMeButtonClick" title="Locate me">
						<ion-icon
							slot="icon-only"
							:icon="icons.navigateIcon"
						></ion-icon>
					</ion-button>

					<!-- login/logout buttons -->
					<ion-button
						@click="onLoginButtonClick"
						v-if="!authService.isAuthenticated()"
						title="Login"
					>
						<ion-icon
							slot="icon-only"
							:icon="icons.loginIcon"
						></ion-icon>
					</ion-button>
					<ion-button
						@click="onLogoutButtonClick"
						v-if="authService.isAuthenticated()"
						title="Logout"
					>
						<ion-icon
							slot="icon-only"
							:icon="icons.logoutIcon"
						></ion-icon>
					</ion-button>

					<!-- menu button -->
					<ion-menu-button
						@click="onMenuButtonClick"
						auto-hide="false"
					></ion-menu-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
		<ion-content id="main-content" :fullscreen="true">
			<GoogleMap
				:api-key="apiKey"
				style="width: 100%; height: 100%"
				:center="mapCenter"
				:zoom="10"
			>
				<!-- current position -->
				<Marker :options="currentPositionMarker" />

				<!-- marker -->
				<Marker
					v-for="(marker, index) in markers"
					:key="index"
					:options="marker"
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
				:mapLat="mapCenter.lat"
				:mapLon="mapCenter.lng"
				@onAddMarker="onAddMarker"
			></add-marker-view>
		</ion-modal>

		<ion-modal
			key="login-dialog"
			mode="ios"
			:swipe-to-close="true"
			:is-open="isShowLoginView"
			css-class="login-view"
			@onDidDismiss="onLoginDismiss"
		>
			<login-view
				@onLoginSuccess="onLoginSuccess"
				@onLoginFailed="onLoginFailed"
			>
				<div
					class="login-error-message"
					v-if="loginErrorMessage?.length > 0"
				>
					<ion-icon :icon="icons.alertCircle" />
					<span>{{ loginErrorMessage }}</span>
				</div>
			</login-view>
		</ion-modal>

		<!-- <ion-toast
			key="toast"
			:is-open="notificationMessage?.length > 0"
			:message="notificationMessage"
			:duration="5000"
			@onDidDismiss="onToastClosed"
		>
		</ion-toast> -->
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

.modal-wrapper {
	margin-top: 10px;
	border-radius: 20px;
	width: 98vw;
	max-width: 500px;
}

div.login-error-message {
	display: flex;
	background-color: #f1d0d0;
	border: 1px solid red;
	border-radius: 0.5em;
	margin: 20px;
	padding: 4px;
	padding-bottom: 5px;
	padding-left: 10px;
	padding-right: 10px;
	align-items: center;
}

div.login-error-message > ion-icon {
	width: 30px;
	height: 30px;
	color: red;
	box-sizing: border-box;
}

div.login-error-message > span {
	margin: 10px;
}


ion-toolbar > ion-searchbar.toolbar-item {
	padding-top: 14px;
}

ion-buttons.ios {
	margin-top: 6px;
}
</style>
