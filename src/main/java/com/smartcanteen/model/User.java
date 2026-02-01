package com.smartcanteen.model;

import java.io.Serializable;

public abstract class User implements Serializable {
    protected String id;
    protected String email;
    protected String password;
    protected String role;

    public User(String id, String email, String password, String role) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }

    @Override
    public String toString() {
        return id + "," + email + "," + password + "," + role;
    }
}
