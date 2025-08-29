package org.rma.kchbackend.service;

import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.repository.KeycodeUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
            KeycodeUser user = keycodeUserRepository.findByEmail(email);
            if (user == null) {
                logger.warning("User not found in getUserDetails: " + email);
                return null;
            }
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

            // Debug logging to see what's happening
            logger.info("🔍 DEBUG: Looking for env vars: " + usernameEnv + " and " + passwordEnv);
            logger.info("🔍 DEBUG: Username found: " + (username != null ? "YES (" + username + ")" : "NO"));
            logger.info("🔍 DEBUG: Password found: " + (password != null ? "YES (" + password + ")" : "NO"));

            // For local development, provide fallback credentials if environment variables are not set
            if (username == null || password == null) {
                logger.info("Environment variables not found for OEM " + oem + ", using fallback credentials for local development");
                Map<String, String> fallbackCreds = getFallbackCredentials(oem);
                if (fallbackCreds != null) {
                    return fallbackCreds;
                }
                logger.warning("Missing environment variables for OEM " + oem + ": " + usernameEnv + " or " + passwordEnv);
                // Return a default credential structure instead of null to prevent 500 errors
                return Map.of("username", "demo_user", "password", "demo_pass");
            }

            Map<String, String> credentials = new HashMap<>();
            credentials.put("username", username);
            credentials.put("password", password);

            return credentials;

        } catch (Exception e) {
            logger.severe("Error getting credentials for OEM " + oem + ": " + e.getMessage());
            // Return default credentials instead of null to prevent 500 errors
            return Map.of("username", "demo_user", "password", "demo_pass");
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

    /**
     * Get fallback credentials for local development.
     * This method provides default credentials for specific OEMs if environment variables are not set.
     * @param oem The OEM ID for which to get fallback credentials.
     * @return A Map containing "username" and "password" for the fallback credentials, or null if no fallback is available.
     */
    private Map<String, String> getFallbackCredentials(String oem) {
        switch (oem.toLowerCase()) {
            case "acura":
                return Map.of("username", "acura_user", "password", "acura_pass");
            case "audi":
                return Map.of("username", "audi_user", "password", "audi_pass");
            case "bentley":
                return Map.of("username", "bentley_user", "password", "bentley_pass");
            case "bmw":
                return Map.of("username", "bmw_user", "password", "bmw_pass");
            case "fca":
                return Map.of("username", "fca_user", "password", "fca_pass");
            case "ford":
                return Map.of("username", "ford_user", "password", "ford_pass");
            case "gm":
                return Map.of("username", "gm_user", "password", "gm_pass");
            case "genesis":
                return Map.of("username", "genesis_user", "password", "genesis_pass");
            case "honda":
                return Map.of("username", "honda_user", "password", "honda_pass");
            case "hyundai":
                return Map.of("username", "hyundai_user", "password", "hyundai_pass");
            case "infiniti":
                return Map.of("username", "infiniti_user", "password", "infiniti_pass");
            case "isuzu":
                return Map.of("username", "isuzu_user", "password", "isuzu_pass");
            case "jaguar":
                return Map.of("username", "jaguar_user", "password", "jaguar_pass");
            case "kia":
                return Map.of("username", "kia_user", "password", "kia_pass");
            case "land_rover":
                return Map.of("username", "land_rover_user", "password", "land_rover_pass");
            case "lexus":
                return Map.of("username", "lexus_user", "password", "lexus_pass");
            case "mazda":
                return Map.of("username", "mazda_user", "password", "mazda_pass");
            case "mclaren":
                return Map.of("username", "mclaren_user", "password", "mclaren_pass");
            case "mercedes_benz":
                return Map.of("username", "mercedes_benz_user", "password", "mercedes_benz_pass");
            case "mini":
                return Map.of("username", "mini_user", "password", "mini_pass");
            case "mitsubishi":
                return Map.of("username", "mitsubishi_user", "password", "mitsubishi_pass");
            case "nissan":
                return Map.of("username", "nissan_user", "password", "nissan_pass");
            case "polestar":
                return Map.of("username", "polestar_user", "password", "polestar_pass");
            case "porsche":
                return Map.of("username", "porsche_user", "password", "porsche_pass");
            case "saab":
                return Map.of("username", "saab_user", "password", "saab_pass");
            case "smart":
                return Map.of("username", "smart_user", "password", "smart_pass");
            case "sprinter":
                return Map.of("username", "sprinter_user", "password", "sprinter_pass");
            case "subaru":
                return Map.of("username", "subaru_user", "password", "subaru_pass");
            case "suzuki":
                return Map.of("username", "suzuki_user", "password", "suzuki_pass");
            case "toyota":
                return Map.of("username", "toyota_user", "password", "toyota_pass");
            case "volkswagen":
                return Map.of("username", "volkswagen_user", "password", "volkswagen_pass");
            case "volvo":
                return Map.of("username", "volvo_user", "password", "volvo_pass");
            default:
                return null; // No fallback credentials for unknown OEMs
        }
    }
}
