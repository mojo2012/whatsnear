<template>
	<div :class="alignment" id="text">{{ text }}</div>
</template>

<script type="ts" src="./ChatBubble.ts"></script>

<style scoped>
div#text {
	display: block;
	margin-top: 5px;
	margin-bottom: 5px;
	padding: 15px;
	border: 1px solid var(--ion-color-primary);
	min-width: 40px;
	min-height: 50px;
	background: rgb(171, 0, 215);
	background: linear-gradient(
		170deg,
		rgba(171, 0, 215, 0.2) 50%,
		rgba(14, 35, 255, 0.2) 100%
	);
}

div.left {
	border-radius: 10px 2px;
}

div.right {
	border-radius: 2px 10px;
	margin-right: 0px;
	margin-left: auto;
	text-align: right;
}
</style>
