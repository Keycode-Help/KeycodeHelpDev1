package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.VehicleRange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VehicleRangeRepository extends JpaRepository<VehicleRange, Long> {
    
    @Query("SELECT vr FROM VehicleRange vr WHERE vr.model.id = :modelId AND vr.yearFrom = :yearFrom AND vr.yearTo = :yearTo")
    List<VehicleRange> findByModelIdAndYearFromAndYearTo(@Param("modelId") Long modelId, @Param("yearFrom") Integer yearFrom, @Param("yearTo") Integer yearTo);
}
