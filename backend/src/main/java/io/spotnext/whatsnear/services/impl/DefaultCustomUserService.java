package io.spotnext.whatsnear.services.impl;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.TreeSet;
import java.util.UUID;
import java.util.function.Supplier;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.spotnext.core.infrastructure.exception.CannotCreateUserException;
import io.spotnext.core.infrastructure.service.ModelService;
import io.spotnext.core.infrastructure.support.Logger;
import io.spotnext.core.security.service.AuthenticationService;
import io.spotnext.itemtype.core.beans.UserData;
import io.spotnext.itemtype.core.user.User;
import io.spotnext.itemtype.core.user.UserGroup;
import io.spotnext.whatsnear.beans.AccessTokenData;
import io.spotnext.whatsnear.beans.CreateUserRequestData;
import io.spotnext.whatsnear.beans.UpdateUserRequestData;
import io.spotnext.whatsnear.itemtypes.AccessToken;
import io.spotnext.whatsnear.repositories.UserRepository;
import io.spotnext.whatsnear.services.CustomUserService;


@Service
public class DefaultCustomUserService
		extends io.spotnext.core.infrastructure.service.impl.DefaultUserService<User, UserGroup>
		implements CustomUserService<User, UserGroup> {

	@Autowired
	private AuthenticationService authenticationService;

	@Autowired
	private ModelService modelService;
	
	@Autowired
	private UserRepository userRepository;

	@Override
	public AccessTokenData login(String uid, String password) {
		var user = authenticationService.getAuthenticatedUser(uid, password, false);

		if (user != null) {
			var customUser = (User) user;
			if (CollectionUtils.isEmpty(customUser.getTokens())) {
				var token = createToken();
				var tokenSet = new HashSet<AccessToken>();
				tokenSet.add(token);
				customUser.setTokens(tokenSet);
				modelService.save(customUser);
				return convertToken(token);
			} else {
				var token = getLatestToken(customUser);
				var now = LocalDateTime.now();
				if (now.isAfter(token.getValidTo())) {
					var newToken = createToken();
					customUser.getTokens().add(newToken);
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
	
	private AccessToken getLatestToken(User user) {
		var tokens = user.getTokens();
		if (CollectionUtils.isNotEmpty(user.getTokens())) {
			Supplier<TreeSet<AccessToken>> token = () -> new TreeSet<AccessToken>(new TokenComparator());
			var sortedTokens = tokens.stream().collect(Collectors.toCollection(token));
			return tokens.iterator().next();
		}
		return null;
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

		var user = modelService.create(User.class);

		user.setUid(data.getUsername());
		user.setPassword(authenticationService.encryptPassword(data.getPassword()));
		user.setFirstname(data.getFirstname());
		user.setLastname(data.getLastname());

		user.setMaxDistance(100000.);
		
		var token = createToken();
		user.getTokens().add(token);
		
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
		final Map<String, Object> params = new HashMap<>();
		params.put("uid", uid);

		var user = modelService.get(User.class, params);
		if (user == null) {
			return false;
		} else {
			return true;
		}
	}
	
	@Override
	public User getUser(String uid) {
		var opt = userRepository.findByUid(uid);
		return opt.isPresent() ? opt.get() : null;
		
	}
	
	//TODO fix this in core
//	@Override
//	public UserGroup getUserGroup(final String uid) {
//		final Map<String, Object> params = new HashMap<>();
//		params.put("uid", uid);
//
//		return modelService.get(getUserGroupType(), params);
//	}
	
	private class TokenComparator implements Comparator<AccessToken> {
		@Override
		public int compare(AccessToken o1, AccessToken o2) {
			return o1.getValidTo().compareTo(o2.getValidTo());
		}
	}

	@Override
	public UserData convert(User user) {
		var data = new UserData();
		data.setId(user.getId().toString());
		data.setUid(user.getUid());
		data.setFirstname(user.getFirstname());
		data.setLastname(user.getLastname());
		data.setMaxDistance(user.getMaxDistance());
		data.setShowOnlyWithinRadius(user.getShowOnlyWithinRadius());
		return data;
	}

	@Override
	public UserData updateUser(UpdateUserRequestData data) {
		var uid = getCurrentUser().getUid();
		var user = getUser(uid);
		
		if (data.getMaxDistance() != null) {
			user.setMaxDistance(data.getMaxDistance());
		}
		
		if (data.getShowOnlyWithinRadius() != null) {
			user.setShowOnlyWithinRadius(data.getShowOnlyWithinRadius());
		}
		
		modelService.save(user);
		
		return convert(user);
	}

}
