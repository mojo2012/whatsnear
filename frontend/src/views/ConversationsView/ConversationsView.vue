<template>
	<ion-page>
		<app-toolbar
			menu-position="end"
			menu-id="conversation-overview-menu"
			content-id="conversation-content"
		>
			<template v-slot:menu>
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
								{{ conversation.title }}
							</ion-label>
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
					placeholder="Search ..."
				></ion-searchbar>
			</template>
		</app-toolbar>

		<ion-content id="conversation-content" :fullscreen="true">
			<ion-split-pane content-id="main">
				<!--  the side menu  -->
				<ion-menu content-id="main">
					<ion-header>
						<ion-toolbar>
							<ion-title>Conversations</ion-title>
						</ion-toolbar>
					</ion-header>
					<ion-content>
						<ion-list>
							<!-- <ion-item v-if="pendingInCreationConversation != null">
								<ion-label>
									{{ getPoiIcon(pendingInCreationConversation.poi.type) }}
									{{ pendingInCreationConversation.poi.title }}
									{{ pendingInCreationConversation.poi.description }}
								</ion-label>
							</ion-item> -->
							<ion-item
								v-for="(conversation, index) in conversations"
								v-bind:class="{
									active:
										conversation.id ===
										selectedConversationId,
								}"
								:button="true"
								@click="
									onConversationSelected(
										$event,
										conversation.id
									)
								"
							>
								<ion-label>
									{{ getPoiIcon(conversation.poi.type) }}
									{{ conversation.poi.title }}
									{{ conversation.poi.description }}
								</ion-label>
							</ion-item>
						</ion-list>
					</ion-content>
				</ion-menu>

				<!-- the main content -->
				<ion-list id="main">
					<!-- <ion-item>
						<chat-bubble text="test" alignment="left">
						</chat-bubble>
					</ion-item>
					<ion-item>
						<chat-bubble text="test 2" alignment="right">
						</chat-bubble>
					</ion-item> -->

					<ion-item v-for="message in messagesOfSelectedConversation">
						<chat-bubble :text="message.text" v-bind:alignment="currentUsername === message.sender ? 'right' : 'left'">
						</chat-bubble>
					</ion-item>
				</ion-list>
				<!-- <ion-input txpe="text" id="new-message"> </ion-input> -->
			</ion-split-pane>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { ConversationsView } from "./ConversationsView";
export default ConversationsView;
</script>

<style scoped>
ion-list#main {
	margin-top: 56px;
}
ion-input#new-message {
	margin: 40px;
}
ion-item.bottom {
	margin-bottom: 0px;
	margin-top: auto;
}
ion-item.active {
	background: green;
	font-weight: bold;
}
</style>
