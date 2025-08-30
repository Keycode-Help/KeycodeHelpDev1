package org.rma.kchbackend.service;

import org.rma.kchbackend.model.Model;
import org.rma.kchbackend.repository.ModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ModelService {

    private final ModelRepository modelRepository;

    @Autowired
    public ModelService(ModelRepository modelRepository) {
        this.modelRepository = modelRepository;
    }

    public List<Model> getModelsByMakeId(Long makeId) {
        return modelRepository.findByMakeId(makeId);
    }

    public List<Model> getAllModels() {
        return modelRepository.findAll();
    }
}
