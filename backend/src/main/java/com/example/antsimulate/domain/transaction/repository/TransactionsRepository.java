package com.example.antsimulate.domain.transaction.repository;

import com.example.antsimulate.domain.account.entity.Account;
import com.example.antsimulate.domain.transaction.entity.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionsRepository extends JpaRepository<Transactions, Long> {
    List<Transactions> findByAccount(Account account);
}
