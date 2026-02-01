package com.smartcanteen.ui;

import com.smartcanteen.model.*;
import com.smartcanteen.service.*;

import java.util.*;

public class CanteenApp {
    private final AuthService authService;
    private final MenuService menuService;
    private final OrderService orderService;
    private final Scanner scanner;
    private User currentUser;

    public CanteenApp() {
        this.authService = new AuthService();
        this.menuService = new MenuService();
        this.orderService = new OrderService();
        this.scanner = new Scanner(System.in);
    }

    public void start() {
        while (true) {
            System.out.println("\n--- Welcome to Smart Canteen ---");
            System.out.println("1. Login");
            System.out.println("2. Register (Customer)");
            System.out.println("3. Exit");
            System.out.print("Choice: ");
            String choice = scanner.nextLine();

            switch (choice) {
                case "1" -> login();
                case "2" -> register();
                case "3" -> System.exit(0);
                default -> System.out.println("Invalid choice.");
            }
        }
    }

    private void login() {
        System.out.print("Email: ");
        String email = scanner.nextLine();
        System.out.print("Password: ");
        String password = scanner.nextLine();

        currentUser = authService.login(email, password);
        if (currentUser != null) {
            System.out.println("Login successful! Welcome " + currentUser.getEmail());
            if (currentUser.getRole().equals("ADMIN")) {
                adminDashboard();
            } else {
                customerDashboard();
            }
        } else {
            System.out.println("Invalid credentials.");
        }
    }

    private void register() {
        System.out.print("New Email: ");
        String email = scanner.nextLine();
        System.out.print("New Password: ");
        String password = scanner.nextLine();

        if (authService.registerCustomer(email, password)) {
            System.out.println("Registration successful! You can now login.");
        } else {
            System.out.println("Email already exists.");
        }
    }

    private void adminDashboard() {
        while (currentUser != null) {
            System.out.println("\n--- Admin Dashboard ---");
            System.out.println("1. View Menu");
            System.out.println("2. Add Food Item");
            System.out.println("3. Update Food Item");
            System.out.println("4. Remove Food Item");
            System.out.println("5. View All Orders");
            System.out.println("6. Update Order Status");
            System.out.println("7. Logout");
            System.out.print("Choice: ");
            String choice = scanner.nextLine();

            switch (choice) {
                case "1" -> viewMenu();
                case "2" -> addFoodItem();
                case "3" -> updateFoodItem();
                case "4" -> removeFoodItem();
                case "5" -> viewAllOrders();
                case "6" -> updateOrderStatus();
                case "7" -> currentUser = null;
                default -> System.out.println("Invalid choice.");
            }
        }
    }

    private void customerDashboard() {
        while (currentUser != null) {
            Customer customer = (Customer) currentUser;
            System.out.println("\n--- Customer Dashboard ---");
            System.out.println("Balance: $" + customer.getBalance());
            System.out.println("1. View Menu & Order");
            System.out.println("2. View My Orders");
            System.out.println("3. Logout");
            System.out.print("Choice: ");
            String choice = scanner.nextLine();

            switch (choice) {
                case "1" -> placeOrder(customer);
                case "2" -> viewCustomerOrders(customer);
                case "3" -> currentUser = null;
                default -> System.out.println("Invalid choice.");
            }
        }
    }

    // --- Admin Actions ---
    private void viewMenu() {
        List<FoodItem> menu = menuService.getMenu();
        System.out.println("\n--- Canteen Menu ---");
        for (FoodItem item : menu) {
            System.out.printf("[%s] %s - $%.2f (%s) [%s]\n",
                    item.getId().substring(0, 4), item.getName(), item.getPrice(),
                    item.getCategory(), item.isAvailable() ? "Available" : "N/A");
        }
    }

    private void addFoodItem() {
        System.out.print("Name: ");
        String name = scanner.nextLine();
        System.out.print("Price: ");
        double price = Double.parseDouble(scanner.nextLine());
        System.out.print("Category: ");
        String category = scanner.nextLine();
        menuService.addFoodItem(name, price, category);
        System.out.println("Food item added.");
    }

    private void updateFoodItem() {
        viewMenu();
        System.out.print("Enter full/partial ID of item to update: ");
        String idPrefix = scanner.nextLine();
        FoodItem item = menuService.getMenu().stream()
                .filter(f -> f.getId().startsWith(idPrefix))
                .findFirst().orElse(null);

        if (item != null) {
            System.out.print("New Price (current " + item.getPrice() + "): ");
            item.setPrice(Double.parseDouble(scanner.nextLine()));
            System.out.print("Available? (true/false): ");
            item.setAvailable(Boolean.parseBoolean(scanner.nextLine()));
            menuService.updateFoodItem(item);
            System.out.println("Updated.");
        }
    }

    private void removeFoodItem() {
        viewMenu();
        System.out.print("Enter ID prefix to remove: ");
        String id = scanner.nextLine();
        menuService.removeFoodItem(menuService.getMenu().stream()
                .filter(f -> f.getId().startsWith(id))
                .map(FoodItem::getId).findFirst().orElse(""));
        System.out.println("Removed.");
    }

    private void viewAllOrders() {
        orderService.getAllOrders()
                .forEach(o -> System.out.printf("Order #%s | Customer: %s | Total: $%.2f | Status: %s\n",
                        o.getOrderId(), o.getCustomerId(), o.getTotalAmount(), o.getStatus()));
    }

    private void updateOrderStatus() {
        viewAllOrders();
        System.out.print("Order ID: ");
        String id = scanner.nextLine();
        System.out.println("Select Status: 1. PREPARING, 2. READY, 3. COMPLETED, 4. CANCELLED");
        int s = Integer.parseInt(scanner.nextLine());
        OrderStatus status = switch (s) {
            case 1 -> OrderStatus.PREPARING;
            case 2 -> OrderStatus.READY;
            case 3 -> OrderStatus.COMPLETED;
            default -> OrderStatus.CANCELLED;
        };
        orderService.updateOrderStatus(id, status);
        System.out.println("Status updated.");
    }

    // --- Customer Actions ---
    private void placeOrder(Customer customer) {
        List<FoodItem> menu = menuService.getAvailableMenu();
        if (menu.isEmpty()) {
            System.out.println("Menu is empty.");
            return;
        }

        List<OrderItem> cart = new ArrayList<>();
        while (true) {
            System.out.println("\n--- Available Food ---");
            for (int i = 0; i < menu.size(); i++) {
                FoodItem f = menu.get(i);
                System.out.printf("%d. %s - $%.2f\n", i + 1, f.getName(), f.getPrice());
            }
            System.out.print("Select item # (0 to finish, -1 to cancel): ");
            int idx = Integer.parseInt(scanner.nextLine());

            if (idx == 0)
                break;
            if (idx == -1)
                return;

            if (idx > 0 && idx <= menu.size()) {
                FoodItem selected = menu.get(idx - 1);
                System.out.print("Quantity: ");
                int qty = Integer.parseInt(scanner.nextLine());
                cart.add(new OrderItem(selected.getId(), selected.getName(), qty, selected.getPrice()));
            }
        }

        if (!cart.isEmpty()) {
            try {
                orderService.placeOrder(customer, cart);
                authService.updateUser(customer); // Update balance in storage
                System.out.println("Order placed successfully!");
            } catch (Exception e) {
                System.out.println("Error: " + e.getMessage());
            }
        }
    }

    private void viewCustomerOrders(Customer customer) {
        List<Order> orders = orderService.getCustomerOrders(customer.getId());
        if (orders.isEmpty()) {
            System.out.println("No orders yet.");
            return;
        }
        for (Order o : orders) {
            System.out.printf("Order #%s | Status: %s | Total: $%.2f\n",
                    o.getOrderId(), o.getStatus(), o.getTotalAmount());
            o.getItems().forEach(i -> System.out.printf("  - %s x%d\n", i.getFoodName(), i.getQuantity()));
        }
    }

    public static void main(String[] args) {
        new CanteenApp().start();
    }
}
