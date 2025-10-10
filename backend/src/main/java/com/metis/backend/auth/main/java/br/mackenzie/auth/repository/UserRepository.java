package br.mackenzie.auth.repository;

import br.mackenzie.auth.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório para gerenciamento de Users no MongoDB
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    /**
     * Busca um usuário pelo email
     * @param email Email do usuário (@mackenzie.br ou @mackenzista.com.br)
     * @return Optional contendo o usuário se encontrado
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Busca um usuário pelo ID do Microsoft Azure AD
     * @param microsoftId ID do usuário no Azure AD
     * @return Optional contendo o usuário se encontrado
     */
    Optional<User> findByMicrosoftId(String microsoftId);
    
    /**
     * Verifica se existe um usuário com o email especificado
     * @param email Email do usuário
     * @return true se existe, false caso contrário
     */
    boolean existsByEmail(String email);
    
    /**
     * Verifica se existe um usuário com o Microsoft ID especificado
     * @param microsoftId ID do usuário no Azure AD
     * @return true se existe, false caso contrário
     */
    boolean existsByMicrosoftId(String microsoftId);
}
