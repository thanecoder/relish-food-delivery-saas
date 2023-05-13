package com.example.demo;

import org.springframework.stereotype.Service;

@Service
public class RestaurantService {

    private final RestaurantRepository repository;

    public RestaurantService(RestaurantRepository repository) {
        this.repository = repository;
    }

    // TODO: move logic out of the controller once this actually needs to do something
}
