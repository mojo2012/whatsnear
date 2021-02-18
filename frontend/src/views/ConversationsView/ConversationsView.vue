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
							<ion-item
								v-for="index in 5"
								v-if="isConversationLoading"
							>
								<ion-thumbnail slot="start" class="skeleton">
									⏱
								</ion-thumbnail>
								<ion-label>
									<p>
										<ion-skeleton-text
											animated
										></ion-skeleton-text>
									</p>
									<p>
										<ion-skeleton-text
											animated
										></ion-skeleton-text>
									</p>
								</ion-label>
							</ion-item>

							<ion-item
								v-if="!isConversationLoading"
								v-for="(conversation, index) in conversations"
								v-bind:class="{
									active:
										conversation.id === selectedConversationId
								}"
								:button="true"
								@click="
									onConversationSelected(
										$event,
										conversation.id
									)
								"
							>
								<ion-thumbnail slot="start">
									{{ getPoiIcon(conversation.poi.type) }}
								</ion-thumbnail>
								<ion-label>
									<p>{{ conversation.poi.title }}</p>
									<p>{{ conversation.poi.description }}</p>
								</ion-label>
							</ion-item>
						</ion-list>
					</ion-content>
				</ion-menu>

				<!-- the main content -->
				<div
					id="main"
					class="menu-content menu-content-overlay split-pane-main md list-md list-lines-none list-md-lines-none hydrated"
				>
					<ion-spinner
						id="message-loading-spinner"
						v-if="isMessageListLoading"
					></ion-spinner>

					<div v-if="!isMessageListLoading">
						<ion-list lines="none" class="message-list">
							<ion-item
								v-for="message in messagesOfSelectedConversation"
							>
								<chat-bubble
									:text="message.text"
									v-bind:alignment="
										currentUsername === message.sender
											? 'right'
											: 'left'
									"
								>
								</chat-bubble>
							</ion-item>
						</ion-list>
						<div>
							<ion-input
								txpe="text"
								placeholder="Send ..."
								id="new-message"
								:value="newMessage"
								v-model="newMessage"
								@keypress="onNewMessageKeypress"
							>
							</ion-input>
							<ion-button
								@click="onSendButtonClick"
								title="Send"
								mode="ios"
								:disabled="newMessage.length == 0"
							>
								<ion-icon
									slot="icon-only"
									:icon="icons.sendIcon"
								></ion-icon>
							</ion-button>
						</div>
					</div>
				</div>
			</ion-split-pane>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { ConversationsView } from "./ConversationsView";
export default ConversationsView;
</script>

<style scoped>
div#main {
	display: flex;
	flex-direction: column-reverse;
	padding-bottom: 50px;
	overflow-y: scroll;
	/* width: 100vw; */
	/* min-width: 100vw; */
}
ion-list.message-list {
	/* padding-top: 56px;
	margin-top: auto; */
	border-bottom: 1px solid grey !important;

	/* height: 100vh; */
}

ion-input#new-message {
	/* margin: 20px !important; */
	padding: 20px !important;
	background-color: #fafafa;
	/* border-radius: 20px; */
}
ion-item.bottom {
	margin-bottom: 0px;
	margin-top: auto;
}
ion-item.active {
	background: green;
	font-weight: bold;
}
ion-spinner#message-loading-spinner {
	margin: auto;
}
ion-thumbnail {
	font-size: 32px;
	line-height: 55px;
	max-width: 30px;
}
.skeleton {
	opacity: 0.3;
}
</style>
