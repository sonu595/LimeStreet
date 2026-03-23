package com.Clothing.Startup.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Clothing.Startup.Model.Contact;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    
}
