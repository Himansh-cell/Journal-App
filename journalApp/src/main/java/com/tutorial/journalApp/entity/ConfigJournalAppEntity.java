package com.tutorial.journalApp.entity;

import lombok.Data;
import lombok.NonNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "config_journal_app")
@Data
public class ConfigJournalAppEntity {
        @Id
        private String id;
        @NonNull
        private String key;
        private String value;

    }


