package com.smartcanteen.model;

public class Admin extends User {
    public Admin(String id, String email, String password) {
        super(id, email, password, "ADMIN");
    }
}
