package com.smartcanteen.service;

import com.smartcanteen.model.Admin;
import com.smartcanteen.model.Customer;
import com.smartcanteen.model.User;
import com.smartcanteen.repository.StorageRepository;

import java.util.List;
import java.util.UUID;

public class AuthService {
    private final StorageRepository<User> userRepository;

    public AuthService() {
        this.userRepository = new StorageRepository<>("data/users.csv", line -> {
            String[] parts = line.split(",");
            String id = parts[0];
            String email = parts[1];
            String password = parts[2];
            String role = parts[3];
            if (role.equals("ADMIN")) {
                return new Admin(id, email, password);
            } else {
                double balance = Double.parseDouble(parts[4]);
                return new Customer(id, email, password, balance);
            }
        });

        // Ensure at least one admin exists
        if (userRepository.getAll().isEmpty()) {
            userRepository.add(new Admin("admin-1", "admin@smartcanteen.com", "admin123"));
        }
    }

    public User login(String email, String password) {
        return userRepository.getAll().stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email) && u.getPassword().equals(password))
                .findFirst()
                .orElse(null);
    }

    public boolean registerCustomer(String email, String password) {
        if (existsByEmail(email)) {
            return false;
        }
        userRepository.add(new Customer(UUID.randomUUID().toString(), email, password, 500.0));
        return true;
    }

    public boolean existsByEmail(String email) {
        return userRepository.getAll().stream().anyMatch(u -> u.getEmail().equalsIgnoreCase(email));
    }

    public List<User> getAllUsers() {
        return userRepository.getAll();
    }

    public void updateUser(User user) {
        List<User> users = userRepository.getAll();
        for (int i = 0; i < users.size(); i++) {
            if (users.get(i).getId().equals(user.getId())) {
                users.set(i, user);
                break;
            }
        }
        userRepository.saveAll(users);
    }
}
