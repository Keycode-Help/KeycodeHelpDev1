package org.rma.kchbackend.controller;

import org.rma.kchbackend.model.State;
import org.rma.kchbackend.service.StateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/states")
public class StateController {

    private final StateService stateService;

    @Autowired
    public StateController(StateService stateService){
        this.stateService = stateService;
    }
    @GetMapping("/")
    public List<State> getAllStates(){
        return stateService.getAllStates();
    }
}
