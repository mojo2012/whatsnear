package io.spotnext.whatsnear.services;

import io.spotnext.itemtype.core.user.User;
import io.spotnext.itemtype.core.user.UserGroup;
import io.spotnext.whatsnear.beans.AccessTokenData;
import io.spotnext.whatsnear.beans.CreateUserRequestData;

public interface CustomUserService<U extends User, G extends UserGroup> extends io.spotnext.core.infrastructure.service.UserService<U, G> {

	public AccessTokenData login(String uid, String password);
	
	public AccessTokenData register(CreateUserRequestData data);
	
}
