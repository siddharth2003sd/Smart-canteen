package com.smartcanteen.model;

import java.util.List;
import java.util.stream.Collectors;

public class Order {
    private String orderId;
    private String customerId;
    private List<OrderItem> items;
    private double totalAmount;
    private OrderStatus status;
    private long timestamp;

    public Order(String orderId, String customerId, List<OrderItem> items, double totalAmount, OrderStatus status, long timestamp) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.items = items;
        this.totalAmount = totalAmount;
        this.status = status;
        this.timestamp = timestamp;
    }

    public String getOrderId() { return orderId; }
    public String getCustomerId() { return customerId; }
    public List<OrderItem> getItems() { return items; }
    public double getTotalAmount() { return totalAmount; }
    public OrderStatus getStatus() { return status; }
    public long getTimestamp() { return timestamp; }

    public void setStatus(OrderStatus status) { this.status = status; }

    @Override
    public String toString() {
        String itemsStr = items.stream()
                .map(OrderItem::toString)
                .collect(Collectors.joining(";"));
        return orderId + "|" + customerId + "|" + itemsStr + "|" + totalAmount + "|" + status + "|" + timestamp;
    }
}
