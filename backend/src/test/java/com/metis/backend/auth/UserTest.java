package com.metis.backend.auth;

import com.metis.backend.auth.models.entities.UserEntity;
import com.metis.backend.auth.repository.RoleRepository;
import com.metis.backend.auth.repository.UserRepository;
import com.metis.backend.auth.service.UserService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.TestPropertySource;
import org.springframework.util.Assert;

import java.util.Optional;

@TestPropertySource(properties = {
        "metis.auth.allowed-email-domains=mackenzie.br,admin-domain.br, test.com",
        "metis.auth.default-roles=ROLE_USER,ROLE_STUDENT",
        "metis.auth.admin-emails=admin@mackenzie.br, admin@test.com"
})
@DataMongoTest
@Import(UserService.class)
public class UserTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    private static final String VALID_EMAIL = "user@mackenzie.br";
    private static final String ADMIN_EMAIL = "admin@mackenzie.br";
    private static final String INVALID_EMAIL = "user@gmail.com";
    private static final String USER_NAME = "Test User";
    private static final String MICROSOFT_ID = "ms-12345";
    private static final String IP_ADDRESS = "192.168.1.1";

    @BeforeEach
    void setup(){
        userRepository.deleteAll();
    }

    @Test
    void loadExistingUserByUsernameAndReturnDetails() {
        UserEntity user = UserEntity.builder().email(VALID_EMAIL).name(USER_NAME).microsoftId(MICROSOFT_ID).build();
        userRepository.save(user);

        UserDetails userDetails = userService.loadUserByUsername(VALID_EMAIL);

        Assert.notNull(userDetails, "User not found");
        Assert.isTrue(VALID_EMAIL.equals(userDetails.getUsername()), "Invalid email: Expected " + VALID_EMAIL + ", found " + userDetails.getUsername());
    }

    @Test
    void isValidMackenzieEmailReturnsTrueForValidEmail(){
        Assert.isTrue(userService.isValidMackenzieEmail(VALID_EMAIL), "Teste da silva");
        Assert.isTrue(userService.isValidMackenzieEmail("other.user@test.com"), "Valid email");
    }

    @Test
    void isValidMackenzieEmailReturnsFalseForInvalidEmail(){
        Assert.isTrue(!userService.isValidMackenzieEmail(INVALID_EMAIL), "Invalid email");
    }

    @Test
    void isValidMackenzieEmailReturnsFalseForNullOrBlankEmail(){
        Assert.isTrue(!userService.isValidMackenzieEmail(null), "Null email");
        Assert.isTrue(!userService.isValidMackenzieEmail(""), "Empty email");
        Assert.isTrue(!userService.isValidMackenzieEmail(" "), "Blank email");
    }

    @Test
    void createOrUpdateUserCreateUserAndReturnSuccess(){
        UserEntity createdUser = userService.createOrUpdateUser(VALID_EMAIL, USER_NAME, MICROSOFT_ID);
        Assert.notNull(createdUser, "Created user not found");
        Assert.isTrue(VALID_EMAIL.equals(createdUser.getEmail()), "Invalid email");
        Assert.isTrue(USER_NAME.equals(createdUser.getName()), "Invalid name");
        Assert.isTrue(MICROSOFT_ID.equals(createdUser.getMicrosoftId()),  "Invalid microsoft id");
        Assert.notNull(createdUser.getCreatedAt(), "CreatedAt should be set on creation");
        Assert.notNull(createdUser.getLastLoginAt(), "LastLoginAt should be updated");
        Assert.isTrue(createdUser.getRoleEntities() != null && !createdUser.getRoleEntities().isEmpty(), "Roles should be assigned to the new user");

        Optional<UserEntity> foundUser = userRepository.findByEmail(VALID_EMAIL);
        Assert.isTrue(foundUser.isPresent(), "User not found on the database");
        Assert.isTrue(foundUser.get().getName().equals(USER_NAME), "Invalid name");
    }

    @Test
    void createOrUpdateUserWithInvalidEmailAndThrowsException(){
        java.lang.IllegalArgumentException thrown = Assertions.assertThrows(java.lang.IllegalArgumentException.class,
                () -> userService.createOrUpdateUser(INVALID_EMAIL, USER_NAME, MICROSOFT_ID),
                "Expected IllegalArgumentException for invalid email domain");

        Assertions.assertEquals("Email does not belong to allowed Mackenzie domains", thrown.getMessage());
        Assert.isTrue(userRepository.findByEmail(INVALID_EMAIL).isEmpty(), "No user should be created with a invalid email");

    }

    @Test
    void roleAssignment(){

    }

    @Test
    void tokenInvalidation(){

    }

    @Test
    void loginInfoUpdate(){

    }

}
