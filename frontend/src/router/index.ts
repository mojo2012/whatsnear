import { createRouter, createWebHistory } from "@ionic/vue-router"
import { RouteRecordRaw } from "vue-router"
import Tabs from "../views/Tabs.vue"

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		redirect: "/tabs/map"
	},
	{
		path: "/",
		component: Tabs,
		children: [
			{
				name: "map-view",
				path: "/tabs/map",
				component: () => import("@/views/MapView/MapView.vue")
			},
			{
				name: "conversations",
				path: "/tabs/conversations",
				component: () => import("@/views/ConversationsView/ConversationsView.vue")
			},
			{
				name: "settings",
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
