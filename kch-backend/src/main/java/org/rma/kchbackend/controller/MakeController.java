package org.rma.kchbackend.controller;

import org.rma.kchbackend.model.Make;
import org.rma.kchbackend.service.MakeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/makes")
@CrossOrigin(origins = "http://localhost:5173")
public class MakeController {

    private final MakeService makeService;

    @Autowired
    public MakeController(MakeService makeService){
        this.makeService = makeService;
    }

    @GetMapping("/getMakes")
    public List<Make> getMakes(){
        return makeService.getMakes();
    }
}
