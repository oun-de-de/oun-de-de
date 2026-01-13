package com.cdtphuhoi.oun_de_de.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/customers")
public class CustomerController {
    @GetMapping
    public ResponseEntity<String> getCustomers() {
        return new ResponseEntity<>(
            "Test",
            HttpStatus.OK
        );
    }
}




