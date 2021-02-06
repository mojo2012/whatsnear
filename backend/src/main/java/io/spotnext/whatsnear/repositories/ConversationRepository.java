package io.spotnext.whatsnear.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import io.spotnext.whatsnear.itemtypes.Conversation;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

}
