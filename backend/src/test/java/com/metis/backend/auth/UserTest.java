package com.metis.backend.auth;

import com.metis.backend.auth.models.entities.UserEntity;
import com.metis.backend.auth.repository.RoleRepository;
import com.metis.backend.auth.repository.UserRepository;
import com.metis.backend.auth.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.Assert;

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
        Assert.isTrue(userService.isValidMackenzieEmail(VALID_EMAIL), "Valid email");
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


}
