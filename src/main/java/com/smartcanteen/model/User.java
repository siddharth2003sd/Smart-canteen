package com.smartcanteen.model;

import java.io.Serializable;

public abstract class User implements Serializable {
    protected String id;
    protected String username;
    protected String password;
    protected String role;

    public User(String id, String username, String password, String role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
    }

    // Getters and Setters
    public String getId() { return id; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getRole() { return role; }

    @Override
    public String toString() {
        return id + "," + username + "," + password + "," + role;
    }
}
