package io.spotnext.whatsnear.services.impl;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.spotnext.core.infrastructure.service.ModelService;
import io.spotnext.core.infrastructure.support.Logger;
import io.spotnext.core.persistence.service.QueryService;
import io.spotnext.core.security.service.AuthenticationService;
import io.spotnext.itemtype.core.user.UserGroup;
import io.spotnext.whatsnear.beans.AccessTokenData;
import io.spotnext.whatsnear.itemtypes.AccessToken;
import io.spotnext.whatsnear.itemtypes.CustomUser;
import io.spotnext.whatsnear.repositories.CustomUserRepository;
import io.spotnext.whatsnear.services.CustomUserService;

@Service
public class DefaultCustomUserService extends io.spotnext.core.infrastructure.service.impl.DefaultUserService<CustomUser, UserGroup>
		implements CustomUserService<CustomUser, UserGroup> {

	@Autowired
	private AuthenticationService authenticationService;
	
	@Autowired
	private CustomUserRepository customUserRepository;
	
	@Autowired
	private ModelService modelService;
	
	@Autowired
	private QueryService queryService;
	
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
//		var query= "SELECT e " +
//				"FROM " + CustomUser.TYPECODE + " AS e " +
//				"JOIN " + AccessToken.PROPERTY_TOKEN  + " as t on e." + CustomUser.PROPERTY_TOKEN + "=t." + AccessToken.PROPERTY_ID + " " + 
//				"WHERE t." + AccessToken.PROPERTY_TOKEN + " = '" + token.getToken() + "' ";
//		var user = queryService.query(query, CustomUser.class);
		
		var user = customUserRepository.findbyToken(token.getToken()).orElse(null);
		return user;
	}
	
	private AccessTokenData convertToken (AccessToken token) {
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

}
