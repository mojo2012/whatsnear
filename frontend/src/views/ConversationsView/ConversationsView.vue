<template>
	<ion-page>
		<app-toolbar />

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
