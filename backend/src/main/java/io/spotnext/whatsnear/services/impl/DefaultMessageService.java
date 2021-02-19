package io.spotnext.whatsnear.services.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

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
	// @Transactional
	public MessageData sendMessage(MessageData data) {
		return transactionService.execute(() -> {
			final var currentUser = userService.getCurrentUser();
			final var conversation = conversationRepository
					.findById(Long.parseLong(data.getConversation()))
					.orElseThrow(() -> new NoSuchElementException(String.format("No conversation with id %s found", data.getConversation())));

			if (currentUser != null) {
				var message = modelService.create(Message.class);
				var sender = userService.getUser(currentUser.getUid());
				message.setSender(sender);
				message.setText(data.getText());
				message.setVisibility(data.getVisibility());
				message.setOwner(conversation);

				updateConversation(conversation, message);

				return convert(message);
			} else {
				throw new RuntimeException("User not authenticated");
			}
		});
	}

	@Override
	@Transactional
	public ConversationData createConversation(ConversationData data) {
		final var currentUser = userService.getCurrentUser();
		final var user = userService.getUser(currentUser.getUid());
		final var poi = pointOfInterestRepository.findById(Long.valueOf(data.getPoi().getId()))
				.orElseThrow(() -> new NoSuchElementException(String.format("No poi with id %s found", data.getPoi().getId())));

		var conversation = poi.getConversation();

		if (conversation == null) {
			conversation = modelService.create(Conversation.class);

			conversation.setPoi(poi);
			conversation.getParticipants().add(user);
			conversation.getParticipants().add(poi.getAuthor());
			conversation = conversationRepository.saveAndFlush(conversation);
			poi.setConversation(conversation);
		}

		return convert(conversation, false);
	}

	private void updateConversation(Conversation conversation, Message message) {
		conversation.getMessages().add(message);
		conversation.getParticipants().add(message.getSender());
		// conversationRepository.saveAndFlush(conversation);
		// modelService.save(conversation);
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
		var conv = conversationRepository
				.findById(Long.valueOf(data.getId()))
				.orElseThrow(() -> new NoSuchElementException(String.format("No conversation with id %s found", data.getId())));

		return conv.getMessages().stream().map(m -> convert(m)).sorted((a, b) -> {
			return a.getCreatedAt().compareTo(b.getCreatedAt());
		}).collect(Collectors.toList());
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

	private Message getMessageById(String id) {
		final Map<String, Object> params = new HashMap<>();
		params.put(Message.PROPERTY_ID, Long.parseLong(id));

		return modelService.get(Message.class, params);
	}

	// @Override
	// public MessageData readMessage(MessageData data) {
	// var message = getMessageById(data.getId());
	// var currentUser = userService.getCurrentUser();
	// var sender = userService.getUser(currentUser.getUid());
	// if (message.getConversation().getParticipants().contains(sender)) {
	// message.setReadStatus(MessageReadStatus.READ);
	// modelService.save(message);
	// return convert(message);
	// } else {
	// throw new RuntimeException("May only read own messages");
	// }
	// }

	@Override
	public ConversationData convert(Conversation conversation, boolean full) {
		var data = new ConversationData();
		if (conversation.getId() != null) {
			data.setId(conversation.getId().toString());
		}
		data.setCreatedAt(conversation.getCreatedAt());

		if (full) {
			data.setPoi(pointOfInterestService.convert(conversation.getPoi()));
			if (CollectionUtils.isNotEmpty(conversation.getParticipants())) {
				data.setParticipants(new ArrayList<>());
				for (var participant : conversation.getParticipants()) {
					data.getParticipants().add(userService.convert(participant));
				}
			}

			if (CollectionUtils.isNotEmpty(conversation.getMessages())) {
				List<MessageData> msgs = new ArrayList<>();
				for (var msg : conversation.getMessages()) {
					msgs.add(convert(msg));
				}
				msgs = msgs.stream().sorted((a, b) -> {
					return a.getCreatedAt().compareTo(b.getCreatedAt());
				}).collect(Collectors.toList());

				data.setMessages(msgs);
			}
		} else {
			var poi = new PointOfInterestData();
			poi.setId(conversation.getPoi().getId().toString());
			data.setPoi(poi);
		}

		return data;
	}

	private MessageData convert(Message message) {
		var data = new MessageData();

		data.setId(message.getId().toString());
		data.setCreatedAt(message.getCreatedAt());

		data.setSender(message.getSender().getUid());
		if (message.getOwner() != null) {
			data.setConversation(message.getOwner().getId().toString());
			if (message.getOwner().getPoi() != null) {
				data.setPoi(message.getOwner().getPoi().getId().toString());
			}
		}
		// data.setSendStatus(message.getSendStatus());
		// data.setReadStatus(message.getReadStatus());
		data.setText(message.getText());
		data.setVisibility(message.getVisibility());

		return data;
	}

}
