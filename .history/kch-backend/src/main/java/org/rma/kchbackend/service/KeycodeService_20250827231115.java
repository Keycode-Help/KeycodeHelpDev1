package org.rma.kchbackend.service;

import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.repository.KeycodeUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class KeycodeService {

    private static final Logger logger = Logger.getLogger(KeycodeService.class.getName());
    
    @Autowired
    private KeycodeUserRepository keycodeUserRepository;

    /**
     * Get user details by email
     */
    public Map<String, Object> getUserDetails(String email) {
        try {
            Optional<KeycodeUser> userOpt = keycodeUserRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                logger.warning("User not found in getUserDetails: " + email);
                return null;
            }

            KeycodeUser user = userOpt.get();
            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("id", user.getId());
            userDetails.put("email", user.getEmail());
            userDetails.put("role", user.getRole());
            userDetails.put("isActive", user.isActive());
            userDetails.put("isAdminApproved", user.isAdminApproved());
            userDetails.put("isValidatedUser", user.isValidatedUser());

            return userDetails;
        } catch (Exception e) {
            logger.severe("Error getting user details for email " + email + ": " + e.getMessage());
            return null;
        }
    }

    /**
     * Get credentials for a specific OEM from environment variables
     */
    public Map<String, String> getCredentials(String oem) {
        try {
            // Map OEM IDs to environment variable names
            Map<String, String> envVarMap = getEnvVarMapping();
            
            if (!envVarMap.containsKey(oem)) {
                logger.warning("Unknown OEM requested: " + oem);
                return null;
            }

            String usernameEnv = envVarMap.get(oem) + "_USER";
            String passwordEnv = envVarMap.get(oem) + "_PASS";

            String username = System.getenv(usernameEnv);
            String password = System.getenv(passwordEnv);

            if (username == null || password == null) {
                logger.warning("Missing environment variables for OEM " + oem + ": " + usernameEnv + " or " + passwordEnv);
                return null;
            }

            Map<String, String> credentials = new HashMap<>();
            credentials.put("username", username);
            credentials.put("password", password);

            return credentials;

        } catch (Exception e) {
            logger.severe("Error getting credentials for OEM " + oem + ": " + e.getMessage());
            return null;
        }
    }

    /**
     * Get list of available portals (without credentials)
     */
    public Map<String, Object> getPortalsList() {
        try {
            // This would typically load from a configuration file or database
            // For now, return a basic structure
            Map<String, Object> portals = new HashMap<>();
            portals.put("meta", Map.of("vsp_id", "4E1B0D2W"));
            
            // List of available OEMs (without sensitive data)
            String[] availableOems = {
                "acura", "audi", "bentley", "bmw", "fca", "ford", "gm", "genesis",
                "honda", "hyundai", "infiniti", "isuzu", "jaguar", "kia", "land_rover",
                "lexus", "mazda", "mclaren", "mercedes_benz", "mini", "mitsubishi",
                "nissan", "polestar", "porsche", "saab", "smart", "sprinter",
                "subaru", "suzuki", "toyota", "volkswagen", "volvo"
            };
            
            portals.put("available_oems", availableOems);
            return portals;

        } catch (Exception e) {
            logger.severe("Error getting portals list: " + e.getMessage());
            return null;
        }
    }

    /**
     * Map OEM IDs to environment variable prefixes
     */
    private Map<String, String> getEnvVarMapping() {
        Map<String, String> mapping = new HashMap<>();
        
        // Map each OEM to its environment variable prefix
        mapping.put("acura", "KCH_ACURA");
        mapping.put("audi", "KCH_AUDI");
        mapping.put("bentley", "KCH_BENTLEY");
        mapping.put("bmw", "KCH_BMW");
        mapping.put("fca", "KCH_FCA");
        mapping.put("ford", "KCH_FORD");
        mapping.put("gm", "KCH_GM");
        mapping.put("genesis", "KCH_GENESIS");
        mapping.put("honda", "KCH_HONDA");
        mapping.put("hyundai", "KCH_HYUNDAI");
        mapping.put("infiniti", "KCH_INFINITI");
        mapping.put("isuzu", "KCH_ISUZU");
        mapping.put("jaguar", "KCH_JAGUAR");
        mapping.put("kia", "KCH_KIA");
        mapping.put("land_rover", "KCH_LAND_ROVER");
        mapping.put("lexus", "KCH_LEXUS");
        mapping.put("mazda", "KCH_MAZDA");
        mapping.put("mclaren", "KCH_MCLAREN");
        mapping.put("mercedes_benz", "KCH_MERCEDES_BENZ");
        mapping.put("mini", "KCH_MINI");
        mapping.put("mitsubishi", "KCH_MITSUBISHI");
        mapping.put("nissan", "KCH_NISSAN");
        mapping.put("polestar", "KCH_POLESTAR");
        mapping.put("porsche", "KCH_PORSCHE");
        mapping.put("saab", "KCH_SAAB");
        mapping.put("smart", "KCH_SMART");
        mapping.put("sprinter", "KCH_SPRINTER");
        mapping.put("subaru", "KCH_SUBARU");
        mapping.put("suzuki", "KCH_SUZUKI");
        mapping.put("toyota", "KCH_TOYOTA");
        mapping.put("volkswagen", "KCH_VOLKSWAGEN");
        mapping.put("volvo", "KCH_VOLVO");

        return mapping;
    }
}
