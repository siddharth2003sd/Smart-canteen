package com.smartcanteen.controller;

import com.smartcanteen.model.*;
import com.smartcanteen.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CanteenController {

    private final AuthService authService;
    private final MenuService menuService;
    private final OrderService orderService;

    @Autowired
    public CanteenController(AuthService authService, MenuService menuService, OrderService orderService) {
        this.authService = authService;
        this.menuService = menuService;
        this.orderService = orderService;
    }

    // --- Authentication ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        User user = authService.login(credentials.get("username"), credentials.get("password"));
        if (user != null) return ResponseEntity.ok(user);
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> data) {
        boolean ok = authService.registerCustomer(data.get("username"), data.get("password"));
        if (ok) return ResponseEntity.ok("Registered");
        return ResponseEntity.badRequest().body("User already exists");
    }

    // --- Menu ---
    @GetMapping("/menu")
    public List<FoodItem> getMenu() {
        return menuService.getMenu();
    }

    @PostMapping("/menu")
    public void addFoodItem(@RequestBody FoodItem item) {
        menuService.addFoodItem(item.getName(), item.getPrice(), item.getCategory());
    }

    @PutMapping("/menu")
    public void updateFoodItem(@RequestBody FoodItem item) {
        menuService.updateFoodItem(item);
    }

    @DeleteMapping("/menu/{id}")
    public void deleteFoodItem(@PathVariable String id) {
        menuService.removeFoodItem(id);
    }

    // --- Orders ---
    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/orders/{customerId}")
    public List<Order> getCustomerOrders(@PathVariable String customerId) {
        return orderService.getCustomerOrders(customerId);
    }

    @PostMapping("/orders/{customerId}")
    public ResponseEntity<?> placeOrder(@PathVariable String customerId, @RequestBody List<OrderItem> items) {
        Customer customer = (Customer) authService.getAllUsers().stream()
                .filter(u -> u.getId().equals(customerId)).findFirst().orElse(null);
        if (customer == null) return ResponseEntity.badRequest().body("Customer not found");
        
        try {
            orderService.placeOrder(customer, items);
            authService.updateUser(customer);
            return ResponseEntity.ok("Order placed");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/orders/{id}/status")
    public void updateStatus(@PathVariable String id, @RequestBody Map<String, String> status) {
        orderService.updateOrderStatus(id, OrderStatus.valueOf(status.get("status")));
    }
}
