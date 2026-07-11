package com.tutorial.journalApp.service;

import com.tutorial.journalApp.entity.JournalEntry;
import com.tutorial.journalApp.entity.User;
import com.tutorial.journalApp.repository.JournalEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Component
public class JournalEntryService {

    @Autowired
    private JournalEntryRepository journalEntryRepository;

    @Autowired
    private UserService userService;

    public List<JournalEntry> getAll(String userName) {
        try {
            User user = userService.getByUsername(userName);
            return user != null ? user.getJournalEntries() : null;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch journal entries", e);
        }
    }

    @Transactional
    public void saveEntry(String username, JournalEntry journalEntry) {
        try {
            User user = userService.getByUsername(username);
            if (journalEntry.getDate() == null) {
                journalEntry.setDate(java.time.LocalDateTime.now());
            }
            JournalEntry saved = journalEntryRepository.save(journalEntry);
            user.getJournalEntries().add(saved);
            userService.saveUser(user);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save journal entry", e);
        }
    }

    public void saveEntry(JournalEntry journalEntry) {
        try {
            if (journalEntry.getDate() == null) {
                journalEntry.setDate(java.time.LocalDateTime.now());
            }
            journalEntryRepository.save(journalEntry);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save journal entry", e);
        }
    }

    public Optional<JournalEntry> getById(String myId) {
        try {
            return journalEntryRepository.findById(myId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch journal entry", e);
        }
    }

    public Optional<JournalEntry> getByIdForUser(String myId, String userName) {
        try {
            User user = userService.getByUsername(userName);
            if (user == null || user.getJournalEntries() == null) {
                return Optional.empty();
            }
            boolean owned = user.getJournalEntries().stream()
                    .anyMatch(entry -> myId.equals(entry.getId()));
            if (!owned) {
                return Optional.empty();
            }
            return journalEntryRepository.findById(myId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch journal entry for user", e);
        }
    }

    public void deleteById(String myId, String userName) {
        try {
            User user = userService.getByUsername(userName);
            user.getJournalEntries().removeIf(x -> x.getId().equals(myId));
            userService.saveUser(user);
            journalEntryRepository.deleteById(myId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete journal entry", e);
        }
    }

    public ResponseEntity<?> updateById(String myId, JournalEntry newEntry, String userName) {
        try {
            JournalEntry oldEntry = journalEntryRepository.findById(myId).orElse(null);
            if (oldEntry != null) {
                oldEntry.setTitle(newEntry.getTitle());
                oldEntry.setContent(newEntry.getContent());
                saveEntry(oldEntry);
                return new ResponseEntity<>(oldEntry, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
