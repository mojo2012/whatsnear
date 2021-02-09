<template>
	<div :class="alignment" id="text">{{ text }}</div>
</template>

<script type="ts" src="./ChatBubble.ts"></script>

<style scoped>
div#text {
	display: block;
	margin-top: 20px;
	margin-bottom: 20px;
	padding: 20px;
	border: 1px solid var(--ion-color-primary);
	min-width: 500px;
	/* color: white; */
	background: rgb(171, 0, 215);
	background: linear-gradient(
		170deg,
		rgba(171, 0, 215, 0.2) 50%,
		rgba(14, 35, 255, 0.2) 100%
	);
}

div.left {
	border-radius: 30px 5px;
}

div.right {
	border-radius: 5px 30px;
	margin-right: 0px;
	margin-left: auto;
}
</style>
