package com.smartcanteen;

import com.smartcanteen.model.*;
import com.smartcanteen.service.*;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

public class WebServer {
    private static AuthService authService;
    private static MenuService menuService;
    private static OrderService orderService;

    public static void main(String[] args) throws IOException {
        authService = new AuthService();
        menuService = new MenuService();
        orderService = new OrderService();

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        // Static Files Handler
        server.createContext("/", new StaticHandler());

        // API Handlers
        server.createContext("/api/login", new LoginHandler());
        server.createContext("/api/register", new RegisterHandler());
        server.createContext("/api/menu", new MenuHandler());
        server.createContext("/api/orders", new OrderHandler());

        server.setExecutor(null);
        System.out.println("Server started at http://localhost:8080");
        server.start();
    }

    static class StaticHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            if (path.equals("/"))
                path = "/index.html";

            Path file = Paths.get("src/main/resources/static" + path);
            if (Files.exists(file)) {
                byte[] bytes = Files.readAllBytes(file);
                String contentType = getContentType(path);
                exchange.getResponseHeaders().set("Content-Type", contentType);
                exchange.sendResponseHeaders(200, bytes.length);
                OutputStream os = exchange.getResponseBody();
                os.write(bytes);
                os.close();
            } else {
                exchange.sendResponseHeaders(404, -1);
            }
        }

        private String getContentType(String path) {
            if (path.endsWith(".html"))
                return "text/html";
            if (path.endsWith(".css"))
                return "text/css";
            if (path.endsWith(".js"))
                return "application/javascript";
            return "text/plain";
        }
    }

    static class LoginHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("POST".equals(exchange.getRequestMethod())) {
                Map<String, String> body = parseJson(exchange.getRequestBody());
                User user = authService.login(body.get("email"), body.get("password"));
                if (user != null) {
                    String json = userToJson(user);
                    sendResponse(exchange, 200, json);
                } else {
                    sendResponse(exchange, 401, "Invalid credentials");
                }
            }
        }
    }

    static class RegisterHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("POST".equals(exchange.getRequestMethod())) {
                Map<String, String> body = parseJson(exchange.getRequestBody());
                boolean ok = authService.registerCustomer(body.get("email"), body.get("password"));
                if (ok)
                    sendResponse(exchange, 200, "Registered");
                else
                    sendResponse(exchange, 400, "User already exists");
            }
        }
    }

    static class MenuHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();
            if ("GET".equals(method)) {
                String json = menuService.getMenu().stream()
                        .map(WebServer::foodItemToJson)
                        .collect(Collectors.joining(",", "[", "]"));
                sendResponse(exchange, 200, json);
            } else if ("POST".equals(method)) {
                Map<String, String> body = parseJson(exchange.getRequestBody());
                menuService.addFoodItem(body.get("name"), Double.parseDouble(body.get("price")), body.get("category"));
                sendResponse(exchange, 201, "Created");
            } else if ("DELETE".equals(method)) {
                String path = exchange.getRequestURI().getPath();
                String id = path.substring(path.lastIndexOf('/') + 1);
                menuService.removeFoodItem(id);
                sendResponse(exchange, 200, "Deleted");
            }
        }
    }

    static class OrderHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();
            String path = exchange.getRequestURI().getPath();

            if ("GET".equals(method)) {
                List<Order> orders;
                if (path.equals("/api/orders")) {
                    orders = orderService.getAllOrders();
                } else {
                    String custId = path.substring(path.lastIndexOf('/') + 1);
                    orders = orderService.getCustomerOrders(custId);
                }
                String json = orders.stream().map(WebServer::orderToJson).collect(Collectors.joining(",", "[", "]"));
                sendResponse(exchange, 200, json);
            } else if ("POST".equals(method)) {
                String custId = path.substring(path.lastIndexOf('/') + 1);
                Customer customer = (Customer) authService.getAllUsers().stream()
                        .filter(u -> u.getId().equals(custId) && u instanceof Customer)
                        .findFirst().orElse(null);

                if (customer == null) {
                    sendResponse(exchange, 404, "Customer not found");
                    return;
                }

                String body = new BufferedReader(new InputStreamReader(exchange.getRequestBody())).lines()
                        .collect(Collectors.joining());
                List<OrderItem> items = parseOrderItems(body);

                try {
                    orderService.placeOrder(customer, items);
                    authService.updateUser(customer);
                    sendResponse(exchange, 200, "{\"message\":\"Order placed successfully\"}");
                } catch (Exception e) {
                    sendResponse(exchange, 400, e.getMessage());
                }
            } else if ("PATCH".equals(method)) {
                String id = path.split("/")[3];
                Map<String, String> body = parseJson(exchange.getRequestBody());
                orderService.updateOrderStatus(id, OrderStatus.valueOf(body.get("status")));
                sendResponse(exchange, 200, "Updated");
            }
        }
    }

    // --- Helpers ---
    private static void sendResponse(HttpExchange exchange, int code, String response) throws IOException {
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(code, bytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(bytes);
        os.close();
    }

    private static List<OrderItem> parseOrderItems(String json) {
        List<OrderItem> items = new ArrayList<>();
        json = json.trim();
        if (json.startsWith("[") && json.endsWith("]")) {
            json = json.substring(1, json.length() - 1);
            String[] objects = json.split("\\},\\{");
            for (String obj : objects) {
                obj = obj.replace("{", "").replace("}", "").replace("\"", "");
                Map<String, String> map = new HashMap<>();
                for (String pair : obj.split(",")) {
                    String[] kv = pair.split(":");
                    if (kv.length == 2)
                        map.put(kv[0].trim(), kv[1].trim());
                }
                items.add(new OrderItem(
                        map.get("foodItemId"),
                        map.get("foodName"),
                        Integer.parseInt(map.get("quantity")),
                        Double.parseDouble(map.get("priceAtTime"))));
            }
        }
        return items;
    }

    private static Map<String, String> parseJson(InputStream is) {
        String body = new BufferedReader(new InputStreamReader(is)).lines().collect(Collectors.joining());
        Map<String, String> map = new HashMap<>();
        body = body.replace("{", "").replace("}", "").replace("\"", "");
        for (String pair : body.split(",")) {
            String[] kv = pair.split(":");
            if (kv.length == 2)
                map.put(kv[0].trim(), kv[1].trim());
        }
        return map;
    }

    private static String userToJson(User u) {
        String base = String.format("{\"id\":\"%s\",\"email\":\"%s\",\"role\":\"%s\"", u.getId(), u.getEmail(),
                u.getRole());
        if (u instanceof Customer) {
            return base + String.format(",\"balance\":%.2f}", ((Customer) u).getBalance());
        }
        return base + "}";
    }

    private static String foodItemToJson(FoodItem f) {
        return String.format("{\"id\":\"%s\",\"name\":\"%s\",\"price\":%.2f,\"category\":\"%s\",\"available\":%b}",
                f.getId(), f.getName(), f.getPrice(), f.getCategory(), f.isAvailable());
    }

    private static String orderToJson(Order o) {
        String items = o.getItems().stream()
                .map(i -> String.format("{\"foodName\":\"%s\",\"quantity\":%d}", i.getFoodName(), i.getQuantity()))
                .collect(Collectors.joining(",", "[", "]"));
        return String.format(
                "{\"orderId\":\"%s\",\"customerId\":\"%s\",\"totalAmount\":%.2f,\"status\":\"%s\",\"items\":%s}",
                o.getOrderId(), o.getCustomerId(), o.getTotalAmount(), o.getStatus(), items);
    }
}
