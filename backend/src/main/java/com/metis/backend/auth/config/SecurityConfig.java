package com.metis.backend.auth.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Slf4j
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final OAuth2AuthenticationSuccessHandler oauth2SuccessHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Desabilita CSRF (usando JWT)
                .csrf(AbstractHttpConfigurer::disable)
                
                // Configura CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                // Configura autorização de requisições
                .authorizeHttpRequests(auth -> auth
                        // Endpoints públicos
                        .requestMatchers(
                                "/api/auth/login",
                                "/oauth2/**",
                                "/login/oauth2/**",
                                "/error",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        
                        // Endpoints administrativos (apenas para ADMIN)
                        .requestMatchers("/api/auth/admin/**").hasRole("ADMIN")
                        
                        // Todos os outros endpoints requerem autenticação
                        .anyRequest().authenticated()
                )
                
                // Configura OAuth2 Login
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oauth2SuccessHandler)
                        .failureHandler((request, response, exception) -> {
                            log.error("❌ OAuth2 Login FAILED: {}", exception.getMessage(), exception);
                            String errorUrl = "http://localhost:3000/login?error=authentication_failed&message=" + 
                                exception.getMessage();
                            response.sendRedirect(errorUrl);
                        })
                )
                
                // Configura gerenciamento de sessão (Stateless para JWT)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                
                // Adiciona o filtro JWT antes do filtro de autenticação padrão
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Permite origens específicas (frontend)
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:3001",
                "https://metis.app" // Adicione seu domínio de produção aqui
        ));
        
        // Permite todos os métodos HTTP
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        
        // Permite todos os headers
        configuration.setAllowedHeaders(List.of("*"));
        
        // Permite credenciais
        configuration.setAllowCredentials(true);
        
        // Expõe headers de autorização
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}
