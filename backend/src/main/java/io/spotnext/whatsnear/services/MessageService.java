package io.spotnext.whatsnear.services;

import java.util.List;

import io.spotnext.itemtype.core.beans.ConversationData;
import io.spotnext.whatsnear.beans.MessageData;

public interface MessageService {

	MessageData sendMessage(MessageData data);
	
	List<ConversationData> getConversations();
	
	List<MessageData> getMessages(ConversationData data);
	
	void deleteMessage(MessageData data);
	
//	MessageData readMessage(MessageData data);
	
}
