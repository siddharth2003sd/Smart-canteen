package com.smartcanteen.model;

public class OrderItem {
    private String foodItemId;
    private String foodName;
    private int quantity;
    private double priceAtTime;

    public OrderItem(String foodItemId, String foodName, int quantity, double priceAtTime) {
        this.foodItemId = foodItemId;
        this.foodName = foodName;
        this.quantity = quantity;
        this.priceAtTime = priceAtTime;
    }

    public String getFoodItemId() { return foodItemId; }
    public String getFoodName() { return foodName; }
    public int getQuantity() { return quantity; }
    public double getPriceAtTime() { return priceAtTime; }

    @Override
    public String toString() {
        return foodItemId + ":" + foodName + ":" + quantity + ":" + priceAtTime;
    }

    public static OrderItem fromString(String str) {
        String[] parts = str.split(":");
        return new OrderItem(parts[0], parts[1], Integer.parseInt(parts[2]), Double.parseDouble(parts[3]));
    }
}
