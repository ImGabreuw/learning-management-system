package com.metis.backend.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.metis.backend.auth.dto.UserDto;
import com.metis.backend.auth.dto.request.LoginRequest;
import com.metis.backend.auth.model.Role;
import com.metis.backend.auth.model.User;
import com.metis.backend.auth.repository.RoleRepository;
import com.metis.backend.auth.repository.UserRepository;
import com.metis.backend.auth.response.AuthResponse;
import com.metis.backend.auth.response.MessageResponse;
import com.metis.backend.auth.security.jwt.JwtTokenProvider;
import com.metis.backend.auth.service.TokenBlacklistService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    private static final String TEST_EMAIL = "test.user@mackenzie.br";
    private static final String TEST_PASSWORD = "Test@123456";
    private static final String INVALID_EMAIL = "invalid@gmail.com";
    private static final String API_AUTH_LOGIN = "/api/auth/login";
    private static final String API_AUTH_LOGOUT = "/api/auth/logout";
    private static final String API_AUTH_VALIDATE = "/api/auth/validate";

    private User testUser;
    private Role alunoRole;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        
        alunoRole = roleRepository.findByName("ALUNO")
                .orElseGet(() -> {
                    Role role = new Role("ALUNO", "Aluno do sistema");
                    return roleRepository.save(role);
                });

        testUser = new User();
        testUser.setEmail(TEST_EMAIL);
        testUser.setPassword(passwordEncoder.encode(TEST_PASSWORD));
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setRoles(Set.of(alunoRole));
        testUser.setEnabled(true);
        testUser = userRepository.save(testUser);
    }

    @AfterEach
    void tearDown() {
        userRepository.deleteAll();
    }

    @Test
    @Order(1)
    @DisplayName("Deve realizar login com sucesso e retornar JWT válido")
    void testLoginSuccess() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(TEST_EMAIL);
        loginRequest.setPassword(TEST_PASSWORD);

        MvcResult result = mockMvc.perform(post(API_AUTH_LOGIN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.expiresIn").exists())
                .andExpect(jsonPath("$.user").exists())
                .andExpect(jsonPath("$.user.email").value(TEST_EMAIL))
                .andExpect(jsonPath("$.user.firstName").value("Test"))
                .andExpect(jsonPath("$.user.lastName").value("User"))
                .andReturn();

        String responseContent = result.getResponse().getContentAsString();
        AuthResponse authResponse = objectMapper.readValue(responseContent, AuthResponse.class);
        
        assertThat(authResponse.getAccessToken()).isNotNull();
        assertThat(authResponse.getAccessToken()).isNotEmpty();
        
        boolean isValidToken = jwtTokenProvider.validarToken(authResponse.getAccessToken());
        assertThat(isValidToken).isTrue();
        
        String emailFromToken = jwtTokenProvider.obterNomeUsuarioDoToken(authResponse.getAccessToken());
        assertThat(emailFromToken).isEqualTo(TEST_EMAIL);
    }

    @Test
    @Order(2)
    @DisplayName("Deve retornar erro 401 com credenciais inválidas")
    void testLoginWithInvalidCredentials() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(TEST_EMAIL);
        loginRequest.setPassword("SenhaErrada@123");

        mockMvc.perform(post(API_AUTH_LOGIN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Email ou senha incorretos"));
    }

    @Test
    @Order(3)
    @DisplayName("Deve retornar erro 401 com email não cadastrado")
    void testLoginWithNonExistentEmail() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("naoexiste@mackenzie.br");
        loginRequest.setPassword(TEST_PASSWORD);

        mockMvc.perform(post(API_AUTH_LOGIN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Email ou senha incorretos"));
    }

    @Test
    @Order(4)
    @DisplayName("Deve retornar erro 401 com email não mackenzista")
    void testLoginWithNonMackenzieEmail() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(INVALID_EMAIL);
        loginRequest.setPassword(TEST_PASSWORD);

        mockMvc.perform(post(API_AUTH_LOGIN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Email ou senha incorretos"));
    }

    @Test
    @Order(5)
    @DisplayName("Deve retornar erro 400 com dados de login inválidos")
    void testLoginWithInvalidData() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("");
        loginRequest.setPassword(TEST_PASSWORD);

        mockMvc.perform(post(API_AUTH_LOGIN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(6)
    @DisplayName("Deve realizar login com email mackenzista.com.br")
    void testLoginWithMackenzistaEmail() throws Exception {
        User mackenzistaUser = new User();
        mackenzistaUser.setEmail("test.user@mackenzista.com.br");
        mackenzistaUser.setPassword(passwordEncoder.encode(TEST_PASSWORD));
        mackenzistaUser.setFirstName("Mackenzista");
        mackenzistaUser.setLastName("User");
        mackenzistaUser.setRoles(Set.of(alunoRole));
        mackenzistaUser.setEnabled(true);
        userRepository.save(mackenzistaUser);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test.user@mackenzista.com.br");
        loginRequest.setPassword(TEST_PASSWORD);

        mockMvc.perform(post(API_AUTH_LOGIN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.user.email").value("test.user@mackenzista.com.br"));
    }

    @Test
    @Order(7)
    @DisplayName("Deve validar token JWT válido com sucesso")
    void testValidateTokenSuccess() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(TEST_EMAIL);
        loginRequest.setPassword(TEST_PASSWORD);

        MvcResult loginResult = mockMvc.perform(post(API_AUTH_LOGIN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String responseContent = loginResult.getResponse().getContentAsString();
        AuthResponse authResponse = objectMapper.readValue(responseContent, AuthResponse.class);
        String token = authResponse.getAccessToken();

        mockMvc.perform(get(API_AUTH_VALIDATE)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Token válido para usuário: " + TEST_EMAIL));
    }

    @Test
    @Order(8)
    @DisplayName("Deve retornar erro 401 ao validar token inválido")
    void testValidateInvalidToken() throws Exception {
        String invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidtoken.signature";

        mockMvc.perform(get(API_AUTH_VALIDATE)
                        .header("Authorization", "Bearer " + invalidToken))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Token inválido"));
    }

    @Test
    @Order(9)
    @DisplayName("Deve retornar erro 401 quando token não é fornecido")
    void testValidateWithoutToken() throws Exception {
        mockMvc.perform(get(API_AUTH_VALIDATE))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Token não fornecido"));
    }

    @Test
    @Order(10)
    @DisplayName("Deve retornar erro 401 quando formato do header é inválido")
    void testValidateWithInvalidHeaderFormat() throws Exception {
        String token = "invalid-format-token";

        mockMvc.perform(get(API_AUTH_VALIDATE)
                        .header("Authorization", token))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Token não fornecido"));
    }

    @Test
    @Order(11)
    @DisplayName("Deve realizar logout com sucesso")
    void testLogoutSuccess() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(TEST_EMAIL);
        loginRequest.setPassword(TEST_PASSWORD);

        MvcResult loginResult = mockMvc.perform(post(API_AUTH_LOGIN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String responseContent = loginResult.getResponse().getContentAsString();
        AuthResponse authResponse = objectMapper.readValue(responseContent, AuthResponse.class);
        String token = authResponse.getAccessToken();

        mockMvc.perform(post(API_AUTH_LOGOUT)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Logout realizado com sucesso"));

        boolean isTokenBlacklisted = tokenBlacklistService.isTokenNaBlacklist(token);
        assertThat(isTokenBlacklisted).isTrue();
    }

    @Test
    @Order(12)
    @DisplayName("Deve retornar erro 400 ao fazer logout sem token")
    void testLogoutWithoutToken() throws Exception {
        mockMvc.perform(post(API_AUTH_LOGOUT))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Token obrigatório"));
    }

    @Test
    @Order(13)
    @DisplayName("Deve retornar sucesso ao fazer logout com token inválido")
    void testLogoutWithInvalidToken() throws Exception {
        String invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidtoken.signature";

        mockMvc.perform(post(API_AUTH_LOGOUT)
                        .header("Authorization", "Bearer " + invalidToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Logout realizado"));
    }

    @Test
    @Order(14)
    @DisplayName("Não deve permitir uso de token após logout")
    void testTokenInvalidAfterLogout() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(TEST_EMAIL);
        loginRequest.setPassword(TEST_PASSWORD);

        MvcResult loginResult = mockMvc.perform(post(API_AUTH_LOGIN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String responseContent = loginResult.getResponse().getContentAsString();
        AuthResponse authResponse = objectMapper.readValue(responseContent, AuthResponse.class);
        String token = authResponse.getAccessToken();

        mockMvc.perform(post(API_AUTH_LOGOUT)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        mockMvc.perform(get(API_AUTH_VALIDATE)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Token inválido"));
    }

    @Test
    @Order(15)
    @DisplayName("Deve realizar fluxo completo: login -> validação -> logout")
    void testCompleteAuthenticationFlow() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(TEST_EMAIL);
        loginRequest.setPassword(TEST_PASSWORD);

        MvcResult loginResult = mockMvc.perform(post(API_AUTH_LOGIN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andReturn();

        String responseContent = loginResult.getResponse().getContentAsString();
        AuthResponse authResponse = objectMapper.readValue(responseContent, AuthResponse.class);
        String token = authResponse.getAccessToken();

        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();

        mockMvc.perform(get(API_AUTH_VALIDATE)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Token válido para usuário: " + TEST_EMAIL));

        mockMvc.perform(post(API_AUTH_LOGOUT)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Logout realizado com sucesso"));

        mockMvc.perform(get(API_AUTH_VALIDATE)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(16)
    @DisplayName("Deve gerar tokens diferentes para logins sequenciais")
    void testSequentialLoginsDifferentTokens() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(TEST_EMAIL);
        loginRequest.setPassword(TEST_PASSWORD);

        MvcResult firstLoginResult = mockMvc.perform(post(API_AUTH_LOGIN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String firstResponseContent = firstLoginResult.getResponse().getContentAsString();
        AuthResponse firstAuthResponse = objectMapper.readValue(firstResponseContent, AuthResponse.class);
        String firstToken = firstAuthResponse.getAccessToken();

        Thread.sleep(1000);

        MvcResult secondLoginResult = mockMvc.perform(post(API_AUTH_LOGIN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String secondResponseContent = secondLoginResult.getResponse().getContentAsString();
        AuthResponse secondAuthResponse = objectMapper.readValue(secondResponseContent, AuthResponse.class);
        String secondToken = secondAuthResponse.getAccessToken();

        assertThat(firstToken).isNotEqualTo(secondToken);
        
        assertThat(jwtTokenProvider.validarToken(firstToken)).isTrue();
        assertThat(jwtTokenProvider.validarToken(secondToken)).isTrue();
    }

    @Test
    @Order(17)
    @DisplayName("Deve retornar estrutura completa do usuário no login")
    void testLoginResponseUserStructure() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(TEST_EMAIL);
        loginRequest.setPassword(TEST_PASSWORD);

        mockMvc.perform(post(API_AUTH_LOGIN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.expiresIn").exists())
                .andExpect(jsonPath("$.user.id").exists())
                .andExpect(jsonPath("$.user.email").value(TEST_EMAIL))
                .andExpect(jsonPath("$.user.firstName").value("Test"))
                .andExpect(jsonPath("$.user.lastName").value("User"))
                .andExpect(jsonPath("$.user.roles").isArray())
                .andExpect(jsonPath("$.user.enabled").value(true));
    }
}
