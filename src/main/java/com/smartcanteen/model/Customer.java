package com.smartcanteen.model;

public class Customer extends User {
    private double balance;

    public Customer(String id, String username, String password, double balance) {
        super(id, username, password, "CUSTOMER");
        this.balance = balance;
    }

    public double getBalance() { return balance; }
    public void setBalance(double balance) { this.balance = balance; }

    @Override
    public String toString() {
        return super.toString() + "," + balance;
    }
}
