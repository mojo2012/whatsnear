package io.spotnext.whatsnear.rest.filters;

import java.time.LocalDateTime;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.spotnext.core.infrastructure.exception.AuthenticationException;
import io.spotnext.core.management.support.AuthenticationFilter;
import io.spotnext.core.management.support.HttpAuthorizationType;
import io.spotnext.itemtype.core.user.User;
import io.spotnext.itemtype.core.user.UserGroup;
import io.spotnext.whatsnear.itemtypes.AccessToken;
import io.spotnext.whatsnear.itemtypes.CustomUser;
import io.spotnext.whatsnear.repositories.AccessTokenRepository;
import io.spotnext.whatsnear.services.CustomUserService;
import spark.Request;
import spark.Response;

@Service
public class CustomAuthenticationFilter implements AuthenticationFilter {

	@Autowired
	private AccessTokenRepository accessTokenRepository;
	
	@Autowired
	private CustomUserService<CustomUser, UserGroup> customUserService;
	
	@Override
	public void handle(Request request, Response response) throws AuthenticationException {
		var authenticatedUser = authenticate(request, response);
		if (checkPermissions(request, authenticatedUser)) {
			customUserService.setCurrentUser(authenticatedUser);
		} else {
			response.header("WWW-Authenticate", HttpAuthorizationType.BASIC.toString());
			throw new AuthenticationException("Could not authenticate user!");
		}
	}
	
	protected boolean checkPermissions(final Request request, User user) {
		return user != null && customUserService.isUserInGroup(user.getUid(), "rest-access");
	}

	protected CustomUser authenticate(final Request request, final Response response) {
		final String authorizationHeader = request.headers("Authorization");

		CustomUser authenticatedUser = null;

		if (StringUtils.isNotBlank(authorizationHeader)) {
			
			var token = accessTokenRepository.findByToken(UUID.fromString(authorizationHeader)).orElse(null);
			
			if (token != null && isValid(token)) {
				return customUserService.getUser(token);
			}
			
		}

		return authenticatedUser;
	}
	
	private boolean isValid(AccessToken token) {
		var now = LocalDateTime.now();
		
		return now.isBefore(token.getValidTo());
	}
	
}
