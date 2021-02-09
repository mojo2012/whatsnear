package io.spotnext.whatsnear.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import io.spotnext.whatsnear.itemtypes.Conversation;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

	Optional<Conversation> findByPoiId(Long poiId);

	boolean existsByPoiId(Long poiId);

}
