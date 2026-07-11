package com.tutorial.journalApp.Service;

import com.tutorial.journalApp.service.EmailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class EmailServiceTests {
    @Autowired
    private EmailService emailService;

    @Test
    void testSendMail(){
        emailService.sendEmail( "hr.himanshuraj1965@gmail.com"
        ,"Testing java mail sender",
                "Hi, aap kaise ho?");
    }

}
