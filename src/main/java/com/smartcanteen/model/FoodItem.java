package com.smartcanteen.model;

public class FoodItem {
    private String id;
    private String name;
    private double price;
    private String category;
    private boolean available;
    private String image;

    public FoodItem(String id, String name, double price, String category, boolean available, String image) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.available = available;
        this.image = image;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public double getPrice() {
        return price;
    }

    public String getCategory() {
        return category;
    }

    public boolean isAvailable() {
        return available;
    }

    public String getImage() {
        return image;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public void setImage(String image) {
        this.image = image;
    }

    @Override
    public String toString() {
        return id + "," + name + "," + price + "," + category + "," + available + "," + image;
    }
}
