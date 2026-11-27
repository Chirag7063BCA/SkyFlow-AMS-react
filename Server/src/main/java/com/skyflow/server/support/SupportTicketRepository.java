package com.skyflow.server.support;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportTicketRepository
        extends JpaRepository<SupportTicket, Long> {

    List<SupportTicket> findAllByOrderByCreatedAtDesc();

    List<SupportTicket> findByEmailOrderByCreatedAtDesc(String email);

    List<SupportTicket> findByStatusOrderByCreatedAtDesc(String status);
}
