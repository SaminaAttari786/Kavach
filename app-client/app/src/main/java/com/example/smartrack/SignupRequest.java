package com.example.smartrack;

public class SignupRequest {
    public String _id;
    public String policeName;
    public String policeNumber;
    public String policePassword;

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getPoliceName() {
        return policeName;
    }

    public void setPoliceName(String policeName) {
        this.policeName = policeName;
    }

    public String getPoliceNumber() {
        return policeNumber;
    }

    public void setPoliceNumber(String policeNumber) {
        this.policeNumber = policeNumber;
    }

    public String getPolicePassword() {
        return policePassword;
    }

    public void setPolicePassword(String policePassword) {
        this.policePassword = policePassword;
    }
}
