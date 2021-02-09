package io.spotnext.whatsnear.services;

import java.util.List;

import io.spotnext.itemtype.core.beans.ConversationData;
import io.spotnext.whatsnear.beans.MessageData;
import io.spotnext.whatsnear.itemtypes.Conversation;

public interface MessageService {

	MessageData sendMessage(MessageData data);
	
	List<ConversationData> getConversations();
	
	List<MessageData> getMessages(ConversationData data);
	
	void deleteMessage(MessageData data);
	
	ConversationData convert(Conversation conversation, boolean full);

	ConversationData createConversation(ConversationData data);

//	MessageData readMessage(MessageData data);
	
}
