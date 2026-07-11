package com.tutorial.journalApp.repository;

import com.tutorial.journalApp.entity.JournalEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface JournalEntryRepository extends MongoRepository<JournalEntry,String> {

}
