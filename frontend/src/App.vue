<template>
	<ion-app>
		<ion-router-outlet />
	</ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
	name: "App",
	components: {
		IonApp,
		IonRouterOutlet,
	},
});
</script>

<style>
* {
	--ion-color-primary: #ab00d7;
	--ion-color-primary-rgb: 171, 0, 215;
	--ion-color-primary-contrast: #ffffff;
	--ion-color-primary-contrast-rgb: 255, 255, 255;
	--ion-color-primary-shade: #9600bd;
	--ion-color-primary-tint: #b31adb;

	--ion-color-secondary: #0e23ff;
	--ion-color-secondary-rgb: 14, 35, 255;
	--ion-color-secondary-contrast: #ffffff;
	--ion-color-secondary-contrast-rgb: 255, 255, 255;
	--ion-color-secondary-shade: #0c1fe0;
	--ion-color-secondary-tint: #2639ff;

	--ion-color-tertiary: #5260ff;
	--ion-color-tertiary-rgb: 82, 96, 255;
	--ion-color-tertiary-contrast: #ffffff;
	--ion-color-tertiary-contrast-rgb: 255, 255, 255;
	--ion-color-tertiary-shade: #4854e0;
	--ion-color-tertiary-tint: #6370ff;

	--ion-color-success: #2dd36f;
	--ion-color-success-rgb: 45, 211, 111;
	--ion-color-success-contrast: #ffffff;
	--ion-color-success-contrast-rgb: 255, 255, 255;
	--ion-color-success-shade: #28ba62;
	--ion-color-success-tint: #42d77d;

	--ion-color-warning: #ffc409;
	--ion-color-warning-rgb: 255, 196, 9;
	--ion-color-warning-contrast: #000000;
	--ion-color-warning-contrast-rgb: 0, 0, 0;
	--ion-color-warning-shade: #e0ac08;
	--ion-color-warning-tint: #ffca22;

	--ion-color-danger: #eb445a;
	--ion-color-danger-rgb: 235, 68, 90;
	--ion-color-danger-contrast: #ffffff;
	--ion-color-danger-contrast-rgb: 255, 255, 255;
	--ion-color-danger-shade: #cf3c4f;
	--ion-color-danger-tint: #ed576b;

	--ion-color-dark: #222428;
	--ion-color-dark-rgb: 34, 36, 40;
	--ion-color-dark-contrast: #ffffff;
	--ion-color-dark-contrast-rgb: 255, 255, 255;
	--ion-color-dark-shade: #1e2023;
	--ion-color-dark-tint: #383a3e;

	--ion-color-medium: #92949c;
	--ion-color-medium-rgb: 146, 148, 156;
	--ion-color-medium-contrast: #ffffff;
	--ion-color-medium-contrast-rgb: 255, 255, 255;
	--ion-color-medium-shade: #808289;
	--ion-color-medium-tint: #9d9fa6;

	--ion-color-light: #f4f5f8;
	--ion-color-light-rgb: 244, 245, 248;
	--ion-color-light-contrast: #000000;
	--ion-color-light-contrast-rgb: 0, 0, 0;
	--ion-color-light-shade: #d7d8da;
	--ion-color-light-tint: #f5f6f9;
}

/* ion-toolbar {
	--background: rgb(14, 35, 255);
	--background: linear-gradient(
		175deg,
		rgba(14, 35, 255, 1) 0%,
		rgba(171, 0, 215, 1) 62%
	);
} */
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

ion-toolbar.main > ion-buttons.ios {
	margin-top: 6px;
}
</style>
