package org.rma.kchbackend.model;

import jakarta.persistence.Entity;
import lombok.Data;

@Data
@Entity
public class AdminUser extends KeycodeUser {
    // You can add additional properties specific to AdminUser if needed.
}
