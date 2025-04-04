package org.rma.kchbackend.controller;

import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Subscription;
import org.rma.kchbackend.service.KeycodeUserService;
import org.rma.kchbackend.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
@RequestMapping("/keycode-user")
@CrossOrigin(origins = "http://localhost:5173")
public class KeycodeUserController {

    private final KeycodeUserService keycodeUserService;
    private final SubscriptionService subscriptionService;

    @Autowired
    public KeycodeUserController(KeycodeUserService keycodeUserService, SubscriptionService subscriptionService) {
        this.keycodeUserService = keycodeUserService;
        this.subscriptionService = subscriptionService;
    }

    @GetMapping("/profile")
    public ResponseEntity<KeycodeUser> getUserProfile(Authentication authentication) {
        String email = authentication.getName();
        KeycodeUser user = keycodeUserService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<String> updateUserProfile(
            Authentication authentication,
            @RequestParam("fname") String fname,
            @RequestParam("lname") String lname,
            @RequestParam("phone") String phone,
            @RequestParam(value = "frontId", required = false) MultipartFile frontId,
            @RequestParam(value = "backId", required = false) MultipartFile backId,
            @RequestParam(value = "insurance", required = false) MultipartFile insurance) {

        String email = authentication.getName();
        keycodeUserService.updateUserProfile(email, fname, lname, phone, frontId, backId, insurance);
        return ResponseEntity.ok("Profile updated successfully");
    }

    @PutMapping("/delete")
    public  ResponseEntity<String> deleteProfile(){
        System.out.println("In Delete Profile");
        try{
            //Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();

            //Check whether details exists for the given user id
            KeycodeUser keycodeUser = keycodeUserService.findByEmail(userEmail)
                                        .orElseThrow(() -> new IllegalArgumentException("User not found"));

            //Set the isActive flag of the user to false
            keycodeUser.setActive(false);
            keycodeUserService.saveUser(keycodeUser);

            //Check whether the user has associated subscription
            Optional<Subscription> optionalSubscription = subscriptionService.getSubscriptionForUser(keycodeUser);
            if(optionalSubscription.isPresent()){
                subscriptionService.removeSubscription(optionalSubscription.get());
            }
            return ResponseEntity.status(200).body("User Profile Deleted Successfully!");
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    //To get User Subscription
    @GetMapping("/subscription")
    public ResponseEntity<Subscription> getUserSubscription(Authentication authentication) {
        String email = authentication.getName();
        KeycodeUser user = keycodeUserService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Optional<Subscription> optionalSubscription = subscriptionService.getSubscriptionForUser(user);
        Subscription userSubscription = null;
        if(optionalSubscription.isPresent()){
            if(optionalSubscription.get().isActivated())
            {
                userSubscription = optionalSubscription.get();
            }

        }
        return ResponseEntity.ok(userSubscription);
    }
}
