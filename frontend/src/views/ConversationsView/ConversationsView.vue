<template>
	<ion-page>
		<ion-header collapse="condense">
			<ion-toolbar>
				<ion-title size="large">Conversations</ion-title>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true">
			<ion-list>
				<ion-item button onclick="showDetail('${tech.title}')">
					<ion-icon
						slot="start"
						name="people-circle-outline"
						style="color: #FFF"
					></ion-icon>
					<ion-label>
						<h3>A</h3>
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
