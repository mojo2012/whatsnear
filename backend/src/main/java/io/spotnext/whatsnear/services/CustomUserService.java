package io.spotnext.whatsnear.services;

import io.spotnext.itemtype.core.beans.UserData;
import io.spotnext.itemtype.core.user.User;
import io.spotnext.itemtype.core.user.UserGroup;
import io.spotnext.whatsnear.beans.AccessTokenData;
import io.spotnext.whatsnear.beans.CreateUserRequestData;
import io.spotnext.whatsnear.beans.UpdateUserRequestData;

public interface CustomUserService<U extends User, G extends UserGroup> extends io.spotnext.core.infrastructure.service.UserService<U, G> {

	public AccessTokenData login(String uid, String password);
	
	public AccessTokenData register(CreateUserRequestData data);
	
	public UserData convert(User user);

	public UserData updateUser(UpdateUserRequestData data);
	
}
