package io.spotnext.whatsnear.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import io.spotnext.whatsnear.itemtypes.AccessToken;
import io.spotnext.whatsnear.itemtypes.CustomUser;

public interface CustomUserRepository extends JpaRepository<CustomUser, Long> {

	@Query(""+
			"SELECT e " +
			"FROM #{#entityName} AS e " +
			"WHERE e." + CustomUser.PROPERTY_TOKEN + "." + AccessToken.PROPERTY_TOKEN + " = :token " + 
			"")
	Optional<CustomUser> findbyToken(@Param("token") UUID token);
	
}
