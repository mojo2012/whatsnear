import { createRouter, createWebHistory } from "@ionic/vue-router"
import { RouteRecordRaw } from "vue-router"
import TabsView from "./views/TabsView/TabsView.vue"

export enum Routes {
	MapView = "map-view",
	Conversations = "conversations",
	Settrings = "settings"
}

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		redirect: "/tabs/map"
	},
	{
		path: "/",
		component: TabsView,
		children: [
			{
				name: Routes.MapView,
				path: "/tabs/map/:poiId?",
				component: () => import("@/views/MapView/MapView.vue")
			},
			{
				name: Routes.Conversations,
				path: "/tabs/conversations/:conversationId?",
				component: () => import("@/views/ConversationsView/ConversationsView.vue")
			},
			{
				name: Routes.Settrings,
				path: "/tabs/settings",
				component: () => import("@/views/SettingsView/SettingsView.vue")
			}
		]
	}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router
