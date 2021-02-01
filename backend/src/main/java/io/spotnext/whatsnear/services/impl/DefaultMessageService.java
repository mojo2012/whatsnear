package io.spotnext.whatsnear.services.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.spotnext.core.infrastructure.service.ModelService;
import io.spotnext.itemtype.core.beans.ConversationData;
import io.spotnext.itemtype.core.user.User;
import io.spotnext.itemtype.core.user.UserGroup;
import io.spotnext.whatsnear.beans.MessageData;
import io.spotnext.whatsnear.itemtypes.Conversation;
import io.spotnext.whatsnear.itemtypes.Message;
import io.spotnext.whatsnear.itemtypes.PointOfInterest;
import io.spotnext.whatsnear.services.CustomUserService;
import io.spotnext.whatsnear.services.MessageService;
import io.spotnext.whatsnear.services.PointOfInterestService;

@Service
public class DefaultMessageService implements MessageService {

	
	@Autowired
	private ModelService modelService;
	
	@Autowired
	private PointOfInterestService pointOfInterestService;
	
	@Autowired
	private CustomUserService<User, UserGroup> userService;
	
	@Override
	@Transactional
	public MessageData sendMessage(MessageData data) {
		var poi = pointOfInterestService.getPoi(data.getPoi());
		var currentUser = userService.getCurrentUser();
		if (currentUser != null) {
			var message = modelService.create(Message.class);
			var sender = userService.getUser(currentUser.getUid());
			message.setSender(sender);
			message.setText(data.getText());
			message.setVisibility(data.getVisibility());
			
			if (poi.getConversation() == null) {
				createConversation(poi, message);
			} else {
				updateConversation(poi.getConversation(), message);
			}
			
			message.setOwner(poi.getConversation());
//			message.setSendStatus(MessageSendStatus.SENT);
//			message.setReadStatus(MessageReadStatus.UNREAD);
			
			modelService.save(message);
			return convert(message);
		} else {
			throw new RuntimeException("User not authenticated");
		}
	}
	
	private void createConversation(PointOfInterest poi, Message message) {
		var conversation = modelService.create(Conversation.class);
		conversation.setPoi(poi);
		conversation.getMessages().add(message);
		conversation.getParticipants().add(message.getSender());
		modelService.save(conversation);
	}
	
	private void updateConversation(Conversation conversation, Message message) {
		conversation.getMessages().add(message);
		conversation.getParticipants().add(message.getSender());
		modelService.save(conversation);
	}

	@Override
	public List<ConversationData> getConversations() {
		var currentUser = userService.getCurrentUser();
		var sender = userService.getUser(currentUser.getUid());
		if (CollectionUtils.isNotEmpty(sender.getConversations())) {
			var convList = new ArrayList<ConversationData>();
			for (var conv : sender.getConversations()) {
				convList.add(convert(conv));
			}
			return convList;
		}
		
		return null;
	}

	@Override
	public List<MessageData> getMessages(ConversationData data) {
		var conversation = getConversationById(data.getId());
		
		return conversation.getMessages().stream().map(m -> convert(m)).collect(Collectors.toList());
	}
	
	@Override
	public void deleteMessage(MessageData data) {
		
		var message = getMessageById(data.getId());
		var currentUser = userService.getCurrentUser();
		var sender = userService.getUser(currentUser.getUid());
		if (message.getSender().equals(sender)) {
			modelService.remove(message);
		} else {
			throw new RuntimeException("May only delete own messages");
		}
		
	}
	
	private Conversation getConversationById(String id) {
		final Map<String, Object> params = new HashMap<>();
		params.put(Message.PROPERTY_ID, Long.parseLong(id));

		return modelService.get(Conversation.class, params);
	}
	
	private Message getMessageById(String id) {
		final Map<String, Object> params = new HashMap<>();
		params.put(Message.PROPERTY_ID, Long.parseLong(id));

		return modelService.get(Message.class, params);
	}

//	@Override
//	public MessageData readMessage(MessageData data) {
//		var message = getMessageById(data.getId());
//		var currentUser = userService.getCurrentUser();
//		var sender = userService.getUser(currentUser.getUid());
//		if (message.getConversation().getParticipants().contains(sender)) {
//			message.setReadStatus(MessageReadStatus.READ);
//			modelService.save(message);
//			return convert(message);
//		} else {
//			throw new RuntimeException("May only read own messages");
//		}
//	}
	
	private ConversationData convert(Conversation conversation) {
		var data = new ConversationData();
		
		data.setPoi(pointOfInterestService.convert(conversation.getPoi()));
		
		if (CollectionUtils.isNotEmpty(conversation.getParticipants())) {
			for (var participant : conversation.getParticipants()) {
				data.getParticipants().add(userService.convert(participant));
			}
		}
		
		if (CollectionUtils.isNotEmpty(conversation.getMessages())) {
			for (var msg : conversation.getMessages()) {
				data.getMessages().add(convert(msg));
			}
		}
		
		return data;
	}
	
	private MessageData convert(Message message) {
		var data = new MessageData();
		
		data.setId(message.getId().toString());
		
		data.setSender(message.getSender().getUid());
		data.setConversation(message.getOwner().getId().toString());
//		data.setSendStatus(message.getSendStatus());
//		data.setReadStatus(message.getReadStatus());
		data.setText(message.getText());
		data.setVisibility(message.getVisibility());

		return data;
	}

}
