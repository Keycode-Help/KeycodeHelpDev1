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
    
    // OEM credentials will be loaded from system properties set by KchBackendApplication
    
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
     * Get credentials for a specific OEM from injected values
     */
    public Map<String, String> getCredentials(String oem) {
        try {
            // Map OEM IDs to injected credential fields
            Map<String, String> credentials = getInjectedCredentials(oem);
            
            if (credentials != null) {
                logger.info("✅ Real credentials found for OEM: " + oem);
                return credentials;
            }
            
            logger.info("Environment variables not found for OEM " + oem + ", using fallback credentials for local development");
            return getFallbackCredentials(oem);
            
        } catch (Exception e) {
            logger.severe("Error getting credentials for OEM " + oem + ": " + e.getMessage());
            return getFallbackCredentials(oem);
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
     * Get credentials from system properties set by KchBackendApplication
     */
    private Map<String, String> getInjectedCredentials(String oem) {
        String username = null;
        String password = null;
        
        switch (oem.toLowerCase()) {
            case "acura":
                username = System.getProperty("KCH_ACURA_USER");
                password = System.getProperty("KCH_ACURA_PASS");
                break;
            case "fca":
                username = System.getProperty("KCH_FCA_USER");
                password = System.getProperty("KCH_FCA_PASS");
                break;
            case "ford":
                username = System.getProperty("KCH_FORD_USER");
                password = System.getProperty("KCH_FORD_PASS");
                break;
            case "gm":
                username = System.getProperty("KCH_GM_USER");
                password = System.getProperty("KCH_GM_PASS");
                break;
            case "genesis":
                username = System.getProperty("KCH_GENESIS_USER");
                password = System.getProperty("KCH_GENESIS_PASS");
                break;
            case "honda":
                username = System.getProperty("KCH_HONDA_USER");
                password = System.getProperty("KCH_HONDA_PASS");
                break;
            case "hyundai":
                username = System.getProperty("KCH_HYUNDAI_USER");
                password = System.getProperty("KCH_HYUNDAI_PASS");
                break;
            case "infiniti":
                username = System.getProperty("KCH_INFINITI_USER");
                password = System.getProperty("KCH_INFINITI_PASS");
                break;
            case "kia":
                username = System.getProperty("KCH_KIA_USER");
                password = System.getProperty("KCH_KIA_PASS");
                break;
            case "lexus":
                username = System.getProperty("KCH_LEXUS_USER");
                password = System.getProperty("KCH_LEXUS_PASS");
                break;
            case "nissan":
                username = System.getProperty("KCH_NISSAN_USER");
                password = System.getProperty("KCH_NISSAN_PASS");
                break;
            case "toyota":
                username = System.getProperty("KCH_TOYOTA_USER");
                password = System.getProperty("KCH_TOYOTA_PASS");
                break;
            case "volvo":
                username = System.getProperty("KCH_VOLVO_USER");
                password = System.getProperty("KCH_VOLVO_PASS");
                break;
            default:
                return null;
        }
        
        if (username != null && !username.isEmpty() && password != null && !password.isEmpty()) {
            Map<String, String> creds = new HashMap<>();
            creds.put("username", username);
            creds.put("password", password);
            return creds;
        }
        
        return null;
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
