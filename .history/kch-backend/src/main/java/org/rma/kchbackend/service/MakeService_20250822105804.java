package org.rma.kchbackend.service;

import org.rma.kchbackend.model.Make;
import org.rma.kchbackend.repository.MakeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MakeService {

    private final MakeRepository makeRepository;

    @Autowired
    public MakeService(MakeRepository makeRepository){
        this.makeRepository = makeRepository;
    }

    public List<Make> getMakes(){
        return makeRepository.findAll();
    }

    public Make getMakeDetails(String manufacturerName){
        return makeRepository.findByName(manufacturerName);
    }
}
