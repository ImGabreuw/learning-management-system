package com.metis.backend.api;

import com.metis.backend.opportunities.models.response.UserProfileCreatedResponse;
import com.metis.backend.opportunities.repositories.EdgeRepository;
import com.metis.backend.opportunities.repositories.NodeRepository;
import com.metis.backend.shared.Utility;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "spring.profiles.active=test",
        }
)
class OpportunityResourceTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private NodeRepository nodeRepository;

    @Autowired
    private EdgeRepository edgeRepository;

    @BeforeEach
    void setUp() {
        edgeRepository.deleteAll();
        nodeRepository.deleteAll();
    }

    @AfterEach
    void tearDown() {
        edgeRepository.deleteAll();
        nodeRepository.deleteAll();
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    @Test
    void shouldCreateUsersProfile() {
        String requestBody = """
                [
                  {
                    "name": "aluno1",
                    "email": "aluno1@mackenzista.com.br",
                    "state": "SP",
                    "city": "São Paulo",
                    "skills": [
                      "Java"
                    ],
                    "interests": [
                      "Inteligência Artificial"
                    ],
                    "preferredJobTypes": []
                  },
                  {
                    "name": "aluno2",
                    "email": "aluno2@mackenzista.com.br",
                    "state": "SP",
                    "city": "São Paulo",
                    "skills": [
                      "Python",
                      "SQL"
                    ],
                    "interests": [
                      "Análise de Dados"
                    ],
                    "preferredJobTypes": []
                  }
                ]
                """;

        HttpEntity<String> entity = new HttpEntity<>(requestBody, createHeaders());

        ResponseEntity<List<UserProfileCreatedResponse>> response = restTemplate.exchange(
                "http://localhost:" + port + "/api/opportunities/user-profile/batch",
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<>() {
                }
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        List<UserProfileCreatedResponse> users = response.getBody();
        assertThat(users).isNotNull();
        assertThat(users.size()).isEqualTo(2);

        for (UserProfileCreatedResponse user : users) {
            String id = user.getId();
            assertThat(id).isNotNull();
            assertThat(Utility.isUUID(id)).isTrue();

            assertThat(user.getSkillsId()).isNotNull();
            assertThat(user.getSkillsId().size()).isGreaterThan(0);
            assertThat(user.getInterestsId()).isNotNull();
            assertThat(user.getInterestsId().size()).isGreaterThan(0);
        }

        assertThat(nodeRepository.count()).isGreaterThan(0);
    }

    @Test
    void saveOpportunitiesBatch_Success() {
        String requestBody = """
                [
                  {
                    "title": "Desenvolvedor(a) de IA Full-Stack",
                    "description": "Buscamos um(a) desenvolvedor(a) para se juntar à nossa equipe de inovação. Você trabalhará no desenvolvimento de soluções de inteligência artificial, utilizando Java e Python para criar e integrar modelos de machine learning em nossas plataformas.",
                    "requiredSkills": [
                      "hab_java",
                      "hab_python"
                    ],
                    "relatedThemes": [
                      "tema_ia"
                    ],
                    "location": "São Paulo, SP",
                    "type": "Tempo Integral",
                    "organization": "InovaTech Soluções",
                    "applicationUrl": "https://inova.tech/carreiras/vaga/dev-ia-fs-01",
                    "applicationDeadline": "2025-11-30",
                    "minimumSalary": 8000.00,
                    "maximumSalary": 12000.00
                  },
                  {
                    "title": "Analista de Dados Jr",
                    "description": "Vaga para atuar na extração, tratamento e análise de grandes volumes de dados. O candidato ideal terá forte conhecimento em SQL e paixão por transformar dados em insights acionáveis para o negócio.",
                    "requiredSkills": [
                      "hab_sql"
                    ],
                    "relatedThemes": [
                      "tema_dados"
                    ],
                    "location": "Remoto",
                    "type": "Tempo Integral",
                    "organization": "DataDriven Corp.",
                    "applicationUrl": "https://datadriven.corp/vagas/analista-jr-02",
                    "applicationDeadline": "2025-12-15",
                    "minimumSalary": 4500.00,
                    "maximumSalary": 6500.00
                  }
                ]
                """;

        HttpEntity<String> entity = new HttpEntity<>(requestBody, createHeaders());

        ResponseEntity<String> response = restTemplate.exchange(
                "http://localhost:" + port + "/api/opportunities/batch",
                HttpMethod.POST,
                entity,
                String.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("id");
        assertThat(response.getBody()).contains("requiredSkillsId");
        assertThat(response.getBody()).contains("relatedThemesId");

        assertThat(nodeRepository.count()).isGreaterThan(0);
    }
}