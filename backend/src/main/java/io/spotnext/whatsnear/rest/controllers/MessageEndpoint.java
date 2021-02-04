package io.spotnext.whatsnear.rest.controllers;

import org.springframework.beans.factory.annotation.Autowired;

import io.spotnext.core.infrastructure.annotation.logging.Log;
import io.spotnext.core.infrastructure.http.DataResponse;
import io.spotnext.core.infrastructure.http.HttpResponse;
import io.spotnext.core.infrastructure.support.LogLevel;
import io.spotnext.core.infrastructure.support.MimeType;
import io.spotnext.core.management.annotation.Handler;
import io.spotnext.core.management.annotation.RemoteEndpoint;
import io.spotnext.core.management.service.impl.AbstractRestEndpoint;
import io.spotnext.core.management.transformer.JsonResponseTransformer;
import io.spotnext.itemtype.core.beans.ConversationData;
import io.spotnext.itemtype.core.beans.SerializationConfiguration;
import io.spotnext.itemtype.core.enumeration.DataFormat;
import io.spotnext.whatsnear.beans.MessageData;
import io.spotnext.whatsnear.rest.filters.CustomAuthenticationFilter;
import io.spotnext.whatsnear.services.MessageService;
import spark.Request;
import spark.Response;
import spark.route.HttpMethod;

@RemoteEndpoint(portConfigKey = "service.typesystem.rest.port", port = 19000, pathMapping = "/v1/conversations", authenticationFilter = CustomAuthenticationFilter.class)
public class MessageEndpoint extends AbstractRestEndpoint{

	private static final SerializationConfiguration CONFIG = new SerializationConfiguration();
	static {
		CONFIG.setFormat(DataFormat.JSON);
	}
	
	@Autowired
	private MessageService messageService;
	
	@Log(logLevel = LogLevel.DEBUG, measureExecutionTime = true)
	@Handler(method = HttpMethod.get, pathMapping = { "/messages/:conversationId"}, mimeType = MimeType.JSON, responseTransformer = JsonResponseTransformer.class)
	public HttpResponse getMessages(final Request request, final Response response) {
		var conversationId = request.params(":conversationId");
		var data = new ConversationData();
		data.setId(conversationId);
		var messages = messageService.getMessages(data);
		
		return DataResponse.ok().withPayload(messages);
	}
	
	@Log(logLevel = LogLevel.DEBUG, measureExecutionTime = true)
	@Handler(method = HttpMethod.get, pathMapping = { "", "/"}, mimeType = MimeType.JSON, responseTransformer = JsonResponseTransformer.class)
	public HttpResponse getConversations(final Request request, final Response response) {
		
		var conversations = messageService.getConversations();
		
		return DataResponse.ok().withPayload(conversations);
	}
	
	@Log(logLevel = LogLevel.DEBUG, measureExecutionTime = true)
	@Handler(method = HttpMethod.post, pathMapping = { "/messages/send"}, mimeType = MimeType.JSON, responseTransformer = JsonResponseTransformer.class)
	public HttpResponse sendMessage(final Request request, final Response response) {
		var data = serializationService.deserialize(CONFIG, request.body(), MessageData.class);
		
		var message = messageService.sendMessage(data);
		
		return DataResponse.ok().withPayload(message);
	}
	
}
