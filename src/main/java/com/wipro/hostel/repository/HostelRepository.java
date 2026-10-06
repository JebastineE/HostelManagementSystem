package com.wipro.hostel.repository;

import com.wipro.hostel.entity.Hostel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface HostelRepository extends JpaRepository<Hostel, Integer> {

    @Query(value = """
            SELECT calculate_hostel_fee(:hostelId, :durationMonths)
            """, nativeQuery = true)
    BigDecimal calculateHostelFee(
            Integer hostelId,
            Integer durationMonths
    );
}