package io.spotnext.whatsnear.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import io.spotnext.whatsnear.itemtypes.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {

}
