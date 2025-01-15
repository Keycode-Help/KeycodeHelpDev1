package org.rma.kchbackend.service;

import org.rma.kchbackend.model.State;
import org.rma.kchbackend.repository.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StateService {

    private final StateRepository stateRepository;

    @Autowired
    public StateService(StateRepository stateRepository){
        this.stateRepository = stateRepository;
    }

    public List<State> getAllStates(){
        return stateRepository.findAll();
    }
}
