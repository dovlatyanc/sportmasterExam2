

package com.shop.sportmaster.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/test")
public class testController {

    @GetMapping("/public")
    public String publicTest() {
        return "PUBLIC OK";
    }

    @GetMapping("/user")
    public String userTest() {
        return "USER OK";
    }

    @GetMapping("/admin")
    public String adminTest() {
        return "ADMIN OK";
    }
}




