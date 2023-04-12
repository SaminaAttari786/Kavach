package com.example.smartrack;

public class LoginRequest {
    public String policeId;
    public String policePassword;

    public String getPoliceId() {
        return policeId;
    }

    public void setPoliceId(String policeId) {
        this.policeId = policeId;
    }

    public String getPolicePassword() {
        return policePassword;
    }

    public void setPolicePassword(String policePassword) {
        this.policePassword = policePassword;
    }
}
