package com.mackenzie.lms.service;

import com.mackenzie.lms.model.Role;
import com.mackenzie.lms.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    public Role findByName(String name) {
        return roleRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Role não encontrada: " + name));
    }

    @PostConstruct
    public void initializeRoles() {
        // Cria roles padrão se não existirem
        createRoleIfNotExists("ADMIN", "Administrador do sistema");
        createRoleIfNotExists("PROFESSOR", "Professor");
        createRoleIfNotExists("ALUNO", "Aluno");
    }

    private void createRoleIfNotExists(String name, String description) {
        if (!roleRepository.existsByName(name)) {
            Role role = new Role(name, description);
            roleRepository.save(role);
        }
    }
}