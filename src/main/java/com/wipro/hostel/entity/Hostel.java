package com.wipro.hostel.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "hostels")
public class Hostel {

    @Id
    private Integer hostelId;

    private String hostelName;

    private String hostelType;

    private String location;

    private BigDecimal monthlyFee;

    public Hostel() {
    }

    public Hostel(Integer hostelId, String hostelName, String hostelType,
                  String location, BigDecimal monthlyFee) {
        this.hostelId = hostelId;
        this.hostelName = hostelName;
        this.hostelType = hostelType;
        this.location = location;
        this.monthlyFee = monthlyFee;
    }

    public Integer getHostelId() {
        return hostelId;
    }

    public void setHostelId(Integer hostelId) {
        this.hostelId = hostelId;
    }

    public String getHostelName() {
        return hostelName;
    }

    public void setHostelName(String hostelName) {
        this.hostelName = hostelName;
    }

    public String getHostelType() {
        return hostelType;
    }

    public void setHostelType(String hostelType) {
        this.hostelType = hostelType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public BigDecimal getMonthlyFee() {
        return monthlyFee;
    }

    public void setMonthlyFee(BigDecimal monthlyFee) {
        this.monthlyFee = monthlyFee;
    }
}