package org.rma.kchbackend.service;

import org.rma.kchbackend.model.SystemType;
import org.rma.kchbackend.repository.SystemTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SystemTypeService {

    private final SystemTypeRepository systemTypeRepository;

    @Autowired
    public SystemTypeService(SystemTypeRepository systemTypeRepository) {
        this.systemTypeRepository = systemTypeRepository;
    }

    public List<SystemType> getSystemTypes() {
        return systemTypeRepository.findAll();
    }
}
