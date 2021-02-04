package io.spotnext.whatsnear.services.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.spotnext.core.infrastructure.service.ModelService;
import io.spotnext.core.persistence.service.TransactionService;
import io.spotnext.itemtype.core.beans.ConversationData;
import io.spotnext.itemtype.core.user.User;
import io.spotnext.itemtype.core.user.UserGroup;
import io.spotnext.whatsnear.beans.MessageData;
import io.spotnext.whatsnear.beans.PointOfInterestData;
import io.spotnext.whatsnear.itemtypes.Conversation;
import io.spotnext.whatsnear.itemtypes.Message;
import io.spotnext.whatsnear.itemtypes.PointOfInterest;
import io.spotnext.whatsnear.repositories.ConversationRepository;
import io.spotnext.whatsnear.repositories.MessageRepository;
import io.spotnext.whatsnear.repositories.PointOfInterestRepository;
import io.spotnext.whatsnear.services.CustomUserService;
import io.spotnext.whatsnear.services.MessageService;
import io.spotnext.whatsnear.services.PointOfInterestService;

@Service
public class DefaultMessageService implements MessageService {

	@Autowired
	private ConversationRepository conversationRepository;
	
	@Autowired
	private MessageRepository messageRepository;
	
	@Autowired
	private ModelService modelService;
	
	@Autowired
	private PointOfInterestRepository pointOfInterestRepository;
	
	@Autowired
	private PointOfInterestService pointOfInterestService;
	
	@Autowired
	private CustomUserService<User, UserGroup> userService;
	
	@Autowired
	private TransactionService transactionService;
	
	@Override
//	@Transactional
	public MessageData sendMessage(MessageData data) {
		return transactionService.execute(() -> {
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
				
//			messageRepository.saveAndFlush(message);
				message.setOwner(poi.getConversation());
//			message.setSendStatus(MessageSendStatus.SENT);
//			message.setReadStatus(MessageReadStatus.UNREAD);
				
//			messageRepository.save(message);
//			modelService.save(message);
				return convert(message);
			} else {
				throw new RuntimeException("User not authenticated");
			}
		});
	}
	
	private void createConversation(PointOfInterest poi, Message message) {
		var conversation = modelService.create(Conversation.class);
		conversation.setPoi(poi);
		conversation.getMessages().add(message);
		conversation.getParticipants().add(message.getSender());
		conversation = conversationRepository.saveAndFlush(conversation);
//		pointOfInterestRepository.flush();
//		poi = pointOfInterestRepository.findById(poi.getId()).get();
		poi.setConversation(conversation);
//		pointOfInterestRepository.saveAndFlush(poi);
//		modelService.save(conversation);
	}
	
	private void updateConversation(Conversation conversation, Message message) {
		conversation.getMessages().add(message);
		conversation.getParticipants().add(message.getSender());
//		conversationRepository.saveAndFlush(conversation);
//		modelService.save(conversation);
	}

	@Override
	public List<ConversationData> getConversations() {
		var currentUser = userService.getCurrentUser();
		var sender = userService.getUser(currentUser.getUid());
		if (CollectionUtils.isNotEmpty(sender.getConversations())) {
			var convList = new ArrayList<ConversationData>();
			for (var conv : sender.getConversations()) {
				convList.add(convert(conv, true));
			}
			return convList;
		}
		
		return null;
	}

	@Override
	public List<MessageData> getMessages(ConversationData data) {
//		var conversation = transactionService.execute(() -> {
			var conv = getConversationById(data.getId());
//			return conv;
//		});
		
		return conv.getMessages().stream().map(m -> convert(m)).collect(Collectors.toList());
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
//		final Map<String, Object> params = new HashMap<>();
//		params.put(Conversation.PROPERTY_ID, Long.parseLong(id));
//
//		return modelService.get(Conversation.class, params);
		return conversationRepository.findById(Long.parseLong(id)).get();
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
	
	@Override
	public ConversationData convert(Conversation conversation, boolean full) {
		var data = new ConversationData();
		
		if (full) {
			data.setPoi(pointOfInterestService.convert(conversation.getPoi()));
		} else {
			var poi = new PointOfInterestData();
			poi.setId(conversation.getPoi().getId().toString());
			data.setPoi(poi);
		}
		
		if (CollectionUtils.isNotEmpty(conversation.getParticipants())) {
			data.setParticipants(new ArrayList<>());
			for (var participant : conversation.getParticipants()) {
				data.getParticipants().add(userService.convert(participant));
			}
		}
		
		if (CollectionUtils.isNotEmpty(conversation.getMessages())) {
			data.setMessages(new ArrayList<>());
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
