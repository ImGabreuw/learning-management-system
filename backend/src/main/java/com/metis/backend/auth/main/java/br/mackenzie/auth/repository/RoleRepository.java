package br.mackenzie.auth.repository;

import br.mackenzie.auth.model.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório para gerenciamento de Roles no MongoDB
 */
@Repository
public interface RoleRepository extends MongoRepository<Role, String> {
    
    /**
     * Busca uma role pelo nome
     * @param name Nome da role (ex: ROLE_USER, ROLE_ADMIN)
     * @return Optional contendo a role se encontrada
     */
    Optional<Role> findByName(String name);
    
    /**
     * Verifica se existe uma role com o nome especificado
     * @param name Nome da role
     * @return true se existe, false caso contrário
     */
    boolean existsByName(String name);
}
