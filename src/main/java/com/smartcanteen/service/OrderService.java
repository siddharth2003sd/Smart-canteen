package com.smartcanteen.service;

import com.smartcanteen.model.*;
import com.smartcanteen.repository.StorageRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class OrderService {
    private final StorageRepository<Order> orderRepository;

    public OrderService() {
        this.orderRepository = new StorageRepository<>("data/orders.csv", line -> {
            String[] parts = line.split("\\|");
            String orderId = parts[0];
            String customerId = parts[1];
            List<OrderItem> items = Arrays.stream(parts[2].split(";"))
                    .map(OrderItem::fromString)
                    .collect(Collectors.toList());
            double total = Double.parseDouble(parts[3]);
            OrderStatus status = OrderStatus.valueOf(parts[4]);
            long timestamp = Long.parseLong(parts[5]);
            return new Order(orderId, customerId, items, total, status, timestamp);
        });
    }

    public void placeOrder(Customer customer, List<OrderItem> items) {
        double total = items.stream().mapToDouble(i -> i.getPriceAtTime() * i.getQuantity()).sum();
        if (customer.getBalance() < total) {
            throw new RuntimeException("Insufficient balance!");
        }
        
        customer.setBalance(customer.getBalance() - total);
        Order order = new Order(
                UUID.randomUUID().toString().substring(0, 8),
                customer.getId(),
                items,
                total,
                OrderStatus.PLACED,
                System.currentTimeMillis()
        );
        orderRepository.add(order);
    }

    public List<Order> getCustomerOrders(String customerId) {
        return orderRepository.getAll().stream()
                .filter(o -> o.getCustomerId().equals(customerId))
                .collect(Collectors.toList());
    }

    public List<Order> getAllOrders() {
        return orderRepository.getAll();
    }

    public void updateOrderStatus(String orderId, OrderStatus status) {
        List<Order> orders = orderRepository.getAll();
        for (Order o : orders) {
            if (o.getOrderId().equals(orderId)) {
                o.setStatus(status);
                break;
            }
        }
        orderRepository.saveAll(orders);
    }
}
