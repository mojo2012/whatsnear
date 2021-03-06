package io.spotnext.whatsnear.rest.controllers;

import org.springframework.beans.factory.annotation.Autowired;

import io.spotnext.core.infrastructure.annotation.logging.Log;
import io.spotnext.core.infrastructure.exception.AuthenticationException;
import io.spotnext.core.infrastructure.exception.CannotCreateUserException;
import io.spotnext.core.infrastructure.http.DataResponse;
import io.spotnext.core.infrastructure.http.HttpResponse;
import io.spotnext.core.infrastructure.http.HttpStatus;
import io.spotnext.core.infrastructure.support.LogLevel;
import io.spotnext.core.infrastructure.support.MimeType;
import io.spotnext.core.management.annotation.Handler;
import io.spotnext.core.management.annotation.RemoteEndpoint;
import io.spotnext.core.management.service.impl.AbstractRestEndpoint;
import io.spotnext.core.management.support.HttpAuthorizationType;
import io.spotnext.core.management.support.NoAuthenticationFilter;
import io.spotnext.core.management.transformer.JsonResponseTransformer;
import io.spotnext.itemtype.core.beans.SerializationConfiguration;
import io.spotnext.itemtype.core.enumeration.DataFormat;
import io.spotnext.itemtype.core.user.User;
import io.spotnext.itemtype.core.user.UserGroup;
import io.spotnext.whatsnear.beans.CreateUserRequestData;
import io.spotnext.whatsnear.beans.LoginRequestData;
import io.spotnext.whatsnear.beans.UpdateUserRequestData;
import io.spotnext.whatsnear.rest.filters.CustomAuthenticationFilter;
import io.spotnext.whatsnear.services.CustomUserService;
import spark.Request;
import spark.Response;
import spark.route.HttpMethod;

@RemoteEndpoint(portConfigKey = "service.typesystem.rest.port", port = 19000, pathMapping = "/v1/account", authenticationFilter = NoAuthenticationFilter.class)
public class AccountEndpoint extends AbstractRestEndpoint {

	private static final SerializationConfiguration CONFIG = new SerializationConfiguration();
	static {
		CONFIG.setFormat(DataFormat.JSON);
	}

	@Autowired
	private CustomUserService<User, UserGroup> customUserService;

	@Log(logLevel = LogLevel.DEBUG, measureExecutionTime = true)
	@Handler(method = HttpMethod.post, pathMapping = { "/login" }, mimeType = MimeType.JSON, responseTransformer = JsonResponseTransformer.class)
	public HttpResponse login(final Request request, final Response response) {
		var data = serializationService.deserialize(CONFIG, request.body(), LoginRequestData.class);

		var token = customUserService.login(data.getUid(), data.getPassword());

		if (token == null) {
			response.header("WWW-Authenticate", HttpAuthorizationType.BASIC.toString());
			throw new AuthenticationException("Could not authenticate user!");
		}

		return DataResponse.ok().withPayload(token);
	}

	@Log(logLevel = LogLevel.DEBUG, measureExecutionTime = true)
	@Handler(method = HttpMethod.post, pathMapping = { "/register" }, mimeType = MimeType.JSON, responseTransformer = JsonResponseTransformer.class)
	public HttpResponse register(final Request request, final Response response) {
		var data = serializationService.deserialize(CONFIG, request.body(), CreateUserRequestData.class);

		var user = customUserService.register(data);

		if (user == null) {
			throw new CannotCreateUserException();
		}

		return DataResponse.ok().withPayload(user);
	}

	@Log(logLevel = LogLevel.DEBUG, measureExecutionTime = true)
	@Handler(method = HttpMethod.get, pathMapping = {
			"/status" }, mimeType = MimeType.JSON, responseTransformer = JsonResponseTransformer.class, authenticationFilter = CustomAuthenticationFilter.class)
	public HttpResponse status(final Request request, final Response response) {
		var userId = customUserService.getCurrentUser().getUid();
		var user = customUserService.getUser(userId);
		var userData = customUserService.convert(user);

		if (userData == null || userData.getUid().equals("anonymous")) {
			return DataResponse.withStatus(HttpStatus.UNAUTHORIZED);
		}

		return DataResponse.ok().withPayload(userData);
	}
	
	@Log(logLevel = LogLevel.DEBUG, measureExecutionTime = true)
	@Handler(method = HttpMethod.put, pathMapping = {
	"/", "" }, mimeType = MimeType.JSON, responseTransformer = JsonResponseTransformer.class, authenticationFilter = CustomAuthenticationFilter.class)
	public HttpResponse update(final Request request, final Response response) {
		var data = serializationService.deserialize(CONFIG, request.body(), UpdateUserRequestData.class);
		
		var user = customUserService.updateUser(data);
		
		return DataResponse.ok().withPayload(user);
	}

}
