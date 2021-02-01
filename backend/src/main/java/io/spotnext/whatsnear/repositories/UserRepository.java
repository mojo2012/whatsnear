package io.spotnext.whatsnear.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import io.spotnext.itemtype.core.user.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByUid(String uid);
	
}
