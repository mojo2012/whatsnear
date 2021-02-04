<template>
	<ion-page>
		<app-toolbar menu-id="conversation-overview-menu">
			<template v-slot:menu>
				<ion-menu
					side="end"
					type="reveal"
					menu-id="conversation-overview-menu"
					content-id="conversation-content"
				>
					<ion-content>
						<ion-list>
							<ion-item
								v-for="(conversation, index) in conversations"
							>
								<ion-icon
									slot="start"
									name="people-circle-outline"
									style="color: #ff0"
								></ion-icon>
								<ion-label>
									{{ conversation.title }} aaa
								</ion-label>
							</ion-item>
						</ion-list>
					</ion-content>
				</ion-menu>
			</template>
		</app-toolbar>

		<ion-content id="conversation-content" :fullscreen="true">
			<ion-list>
				<ion-item v-for="(conversation, index) in conversations">
					<ion-icon
						slot="start"
						name="people-circle-outline"
						style="color: #ff0"
					></ion-icon>
					<ion-label>{{conversation.poi.type}} {{ conversation.poi.title }} </ion-label>
				</ion-item>
			</ion-list>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { ConversationsView } from "./ConversationsView";
export default ConversationsView;
</script>
