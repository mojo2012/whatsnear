package io.spotnext.whatsnear.services.impl;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.spotnext.core.infrastructure.exception.CannotCreateUserException;
import io.spotnext.core.infrastructure.service.ModelService;
import io.spotnext.core.infrastructure.support.Logger;
import io.spotnext.core.security.service.AuthenticationService;
import io.spotnext.itemtype.core.user.UserGroup;
import io.spotnext.whatsnear.beans.AccessTokenData;
import io.spotnext.whatsnear.beans.CreateUserRequestData;
import io.spotnext.whatsnear.itemtypes.AccessToken;
import io.spotnext.whatsnear.itemtypes.CustomUser;
import io.spotnext.whatsnear.repositories.CustomUserRepository;
import io.spotnext.whatsnear.services.CustomUserService;

@Service
public class DefaultCustomUserService
		extends io.spotnext.core.infrastructure.service.impl.DefaultUserService<CustomUser, UserGroup>
		implements CustomUserService<CustomUser, UserGroup> {

	@Autowired
	private AuthenticationService authenticationService;

	@Autowired
	private CustomUserRepository customUserRepository;

	@Autowired
	private ModelService modelService;

	@Override
	public AccessTokenData login(String uid, String password) {
		var user = authenticationService.getAuthenticatedUser(uid, password, false);

		if (user != null && user instanceof CustomUser) {
			var customUser = (CustomUser) user;
			if (customUser.getToken() == null) {
				var token = createToken();
				customUser.setToken(token);
				modelService.save(customUser);
				return convertToken(token);
			} else {
				var token = customUser.getToken();
				var now = LocalDateTime.now();
				if (now.isAfter(token.getValidTo())) {
					var newToken = createToken();
					customUser.setToken(newToken);
					modelService.save(customUser);
					return convertToken(newToken);
				} else {
					return convertToken(token);
				}
			}
		} else {
			Logger.warn(String.format("Could not authenticate user '%s'", uid));
			return null;
		}

	}

	@Override
	public CustomUser getUser(AccessToken token) {
		var user = customUserRepository.findbyToken(token.getToken()).orElse(null);
		return user;
	}

	private AccessTokenData convertToken(AccessToken token) {
		var data = new AccessTokenData();

		data.setToken(token.getToken());
		data.setValidTo(token.getValidTo());

		return data;
	}

	private AccessToken createToken() {
		var token = modelService.create(AccessToken.class);

		token.setToken(UUID.randomUUID());

		var now = LocalDateTime.now();
		token.setValidTo(now.plusHours(24));

		return token;
	}

	@Override
	public AccessTokenData register(CreateUserRequestData data) {
		if (StringUtils.isBlank(data.getUsername()) || checkIfUsernameExists(data.getUsername())) {
			throw new CannotCreateUserException();
		}

		var user = modelService.create(CustomUser.class);

		user.setUid(data.getUsername());
		user.setPassword(authenticationService.encryptPassword(data.getPassword()));
		user.setFirstname(data.getFirstname());
		user.setLastname(data.getLastname());

		user.setMaxDistance(100000.);
		
		var token = createToken();
		user.setToken(token);
		
		var userGroup = getUserGroup("rest-access");
		user.getGroups().add(userGroup);
		
		modelService.save(user);
		
		return convertToken(token);
	}

//	private CustomUserData convert(CustomUser user) {
//		var data = new CustomUserData();
//
//		data.setUid(user.getUid());
////		data.setPassword(user.getPassword());
//		data.setFirstname(user.getFirstname());
//		data.setLastname(user.getLastname());
//		data.setPassword(user.getPassword());
//		data.setMaxDistance(user.getMaxDistance());
//
//		return data;
//	}

	private boolean checkIfUsernameExists(String uid) {
		var userOpt = customUserRepository.findByUid(uid);
		return userOpt.isPresent();
	}
	
	//TODO fix this in core
	@Override
	public UserGroup getUserGroup(final String uid) {
		final Map<String, Object> params = new HashMap<>();
		params.put("uid", uid);

		return modelService.get(getUserGroupType(), params);
	}

}
