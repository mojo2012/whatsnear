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
				<div
					id="main"
					class="menu-content menu-content-overlay split-pane-main md list-md list-lines-none list-md-lines-none hydrated"
				>
					<div>
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
							>
							</ion-input>
							<ion-button
								@click="onSendButtonClick"
								title="Send"
								mode="ios"
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
</style>
