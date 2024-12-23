package org.rma.kchbackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "First name cannot be empty")
    private String fname;

    @NotBlank(message = "Last name cannot be empty")
    private String lname;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email cannot be empty")
    private String email;

    private String phone;

    @NotBlank(message = "Password cannot be empty")
    private String password;

    private byte[] frontId; 
    private byte[] backId;
    private byte[] insurance;
}
