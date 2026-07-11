package com.tutorial.journalApp.entity;

import lombok.Data;
import lombok.NonNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.lang.annotation.Documented;
import java.time.LocalDateTime;

@Document(collection = "journal_entries")
@Data
public class JournalEntry {
@Id
    private String id;
    @NonNull
    private String title;
    private String content;
    private LocalDateTime date;
}



