<template>
	<ion-page>
		<ion-header>
			<ion-toolbar class="main"  color="primary">
				<ion-searchbar
					debounce="1000"
					animated
					mode="ios"
					class="toolbar-item"
					@input="onSearchBarInput"
					placeholder="Filter ..."
				></ion-searchbar>

				<ion-buttons slot="end" class="toolbar-item">
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

		<ion-content :fullscreen="true">
			<ion-list>
				<ion-item v-for="(conversation, index) in conversations">
					<ion-icon
						slot="start"
						name="people-circle-outline"
						style="color: #fff"
					></ion-icon>
					<ion-label>
						<h3>{{ conversation.poi }}</h3>
					</ion-label>
				</ion-item>
			</ion-list>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { ConversationsView } from "./ConversationsView";
export default ConversationsView;
</script>
