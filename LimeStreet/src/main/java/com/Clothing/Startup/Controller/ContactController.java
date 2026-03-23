package com.Clothing.Startup.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Clothing.Startup.Model.Contact;
import com.Clothing.Startup.Repository.ContactRepository;

@RestController
@RequestMapping("/api/contact")
public class ContactController {
    @Autowired
    private ContactRepository repo;

    @PostMapping
    public Contact saveMessage(@RequestBody Contact c){
        return repo.save(c);
    }
}
