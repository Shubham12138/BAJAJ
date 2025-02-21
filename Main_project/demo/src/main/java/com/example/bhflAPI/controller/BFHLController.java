package com.example.bhflAPI.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@CrossOrigin(origins = "*") // Allow cross-origin calls (for frontend integration)
@RestController
@RequestMapping("/bfhl")
public class BFHLController {

    // Hardcoded user details
    private final String USER_ID = "Shubham";
    private final String EMAIL = "shubham@gmail.com";
    private final String ROLL_NUMBER = "BCS16939";

    // POST endpoint
    @PostMapping
    public ResponseEntity<Map<String, Object>> processData(@RequestBody Map<String, Object> payload) {
        try {
            if (!payload.containsKey("data") || !(payload.get("data") instanceof List)) {
                throw new Exception("Invalid JSON format. 'data' key is missing or not an array.");
            }

            List<?> dataList = (List<?>) payload.get("data");
            List<String> numbers = new ArrayList<>();
            List<String> alphabets = new ArrayList<>();

            // Process each element in the list
            for (Object obj : dataList) {
                String value = obj.toString();
                if (value.matches("\\d+")) { // Check if value is all digits
                    numbers.add(value);
                } else if (value.matches("[a-zA-Z]")) { // Check if it is a single alphabet letter
                    alphabets.add(value);
                }
            }

            // Determine highest alphabet (case-insensitive)
            List<String> highestAlphabet = new ArrayList<>();
            if (!alphabets.isEmpty()) {
                // Sort alphabets ignoring case to get the last (highest) value
                alphabets.sort((a, b) -> a.compareToIgnoreCase(b));
                String highest = alphabets.get(alphabets.size() - 1);
                highestAlphabet.add(highest);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("is_success", true);
            response.put("user_id", USER_ID);
            response.put("email", EMAIL);
            response.put("roll_number", ROLL_NUMBER);
            response.put("numbers", numbers);
            response.put("alphabets", alphabets);
            response.put("highest_alphabet", highestAlphabet);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("is_success", false);
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }

    // GET endpoint
    @GetMapping
    public ResponseEntity<Map<String, Object>> getOperationCode() {
        Map<String, Object> response = new HashMap<>();
        response.put("operation_code", 1);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
