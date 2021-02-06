/* eslint-disable max-classes-per-file */
import { Options, prop, Vue } from "vue-class-component"

class Props {
	public text = prop({
		type: String,
		required: true
	})
	public alignment = prop({
		type: String,
		required: true
	})
}

@Options({
	name: "chat-bubble",
	components: {}
})
export default class ChatBubble extends Vue.with(Props) {
	//
}
