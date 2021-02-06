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
	border: 2px solid var(--ion-color-primary);
	background-color: white;
	min-width: 500px;
	/* color: white; */
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
