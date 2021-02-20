/* eslint-disable max-classes-per-file */
import { Options, Vue } from "vue-class-component"
import { Prop } from "vue-decorator"

// class Props {
// 	public text = prop({
// 		type: String,
// 		required: true
// 	})
// 	public alignment = prop({
// 		type: String,
// 		required: true
// 	})
// }

@Options({
	name: "chat-bubble",
	components: {}
})
export default class ChatBubble extends Vue {
	@Prop({ default: "", required: true, type: String })
	public readonly text!: string

	@Prop({ default: "left", required: true, type: String })
	public readonly alignment!: string
}
