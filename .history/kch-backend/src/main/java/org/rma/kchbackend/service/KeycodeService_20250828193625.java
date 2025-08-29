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
    
    // Inject all the OEM credentials using @Value - THIS IS REQUIRED TO READ FROM .env FILE
    @Value("${KCH_ACURA_USER:}")
    private String acuraUser;
    
    @Value("${KCH_ACURA_PASS:}")
    private String acuraPass;
    
    @Value("${KCH_FCA_USER:}")
    private String fcaUser;
    
    @Value("${KCH_FCA_PASS:}")
    private String fcaPass;
    
    @Value("${KCH_FORD_USER:}")
    private String fordUser;
    
    @Value("${KCH_FORD_PASS:}")
    private String fordPass;
    
    @Value("${KCH_GM_USER:}")
    private String gmUser;
    
    @Value("${KCH_GM_PASS:}")
    private String gmPass;
    
    @Value("${KCH_GENESIS_USER:}")
    private String genesisUser;
    
    @Value("${KCH_GENESIS_PASS:}")
    private String genesisPass;
    
    @Value("${KCH_HONDA_USER:}")
    private String hondaUser;
    
    @Value("${KCH_HONDA_PASS:}")
    private String hondaPass;
    
    @Value("${KCH_HYUNDAI_USER:}")
    private String hyundaiUser;
    
    @Value("${KCH_HYUNDAI_PASS:}")
    private String hyundaiPass;
    
    @Value("${KCH_INFINITI_USER:}")
    private String infinitiUser;
    
    @Value("${KCH_INFINITI_PASS:}")
    private String infinitiPass;
    
    @Value("${KCH_KIA_USER:}")
    private String kiaUser;
    
    @Value("${KCH_KIA_PASS:}")
    private String kiaPass;
    
    @Value("${KCH_LEXUS_USER:}")
    private String lexusUser;
    
    @Value("${KCH_LEXUS_PASS:}")
    private String lexusPass;
    
    @Value("${KCH_NISSAN_USER:}")
    private String nissanUser;
    
    @Value("${KCH_NISSAN_PASS:}")
    private String nissanPass;
    
    @Value("${KCH_TOYOTA_USER:}")
    private String toyotaUser;
    
    @Value("${KCH_TOYOTA_PASS:}")
    private String toyotaPass;
    
    @Value("${KCH_VOLVO_USER:}")
    private String volvoUser;
    
    @Value("${KCH_VOLVO_PASS:}")
    private String volvoPass;
    
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
     * Get credentials from injected @Value fields
     */
    private Map<String, String> getInjectedCredentials(String oem) {
        String username = null;
        String password = null;
        
        switch (oem.toLowerCase()) {
            case "acura":
                username = acuraUser;
                password = acuraPass;
                break;
            case "fca":
                username = fcaUser;
                password = fcaPass;
                break;
            case "ford":
                username = fordUser;
                password = fordPass;
                break;
            case "gm":
                username = gmUser;
                password = gmPass;
                break;
            case "genesis":
                username = genesisUser;
                password = genesisPass;
                break;
            case "honda":
                username = hondaUser;
                password = hondaPass;
                break;
            case "hyundai":
                username = hyundaiUser;
                password = hyundaiPass;
                break;
            case "infiniti":
                username = infinitiUser;
                password = infinitiPass;
                break;
            case "kia":
                username = kiaUser;
                password = kiaPass;
                break;
            case "lexus":
                username = lexusUser;
                password = lexusPass;
                break;
            case "nissan":
                username = nissanUser;
                password = nissanPass;
                break;
            case "toyota":
                username = toyotaUser;
                password = toyotaPass;
                break;
            case "volvo":
                username = volvoUser;
                password = volvoPass;
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
