package io.spotnext.whatsnear.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import io.spotnext.whatsnear.itemtypes.PointOfInterest;
import io.spotnext.whatsnear.itemtypes.enumeration.PointOfInterestType;

@Repository
public interface PointOfInterestRepository extends JpaRepository<PointOfInterest, Long> {

	@Query(""+
			"SELECT e " +
			"FROM #{#entityName} AS e " +
			"WHERE (CAST(:type as string) IS NULL OR e.type       = :type) " +
			"AND (:text IS NULL OR LOWER(e.title) LIKE %:text% OR LOWER(e.description) LIKE %:text%) " +
			"")
	List<PointOfInterest> findAllByTypeAndText(@Param("type") PointOfInterestType type, @Param("text") String text);
	
}
