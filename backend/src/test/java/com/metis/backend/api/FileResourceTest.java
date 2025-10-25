package com.metis.backend.api;

import com.metis.backend.files.models.responses.FileUploadResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "spring.profiles.active=test",
        }
)
class FileResourceTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private GridFsTemplate gridFsTemplate;

    @BeforeEach
    void setUp() {
        gridFsTemplate.delete(new Query());
    }

    @AfterEach
    void tearDown() {
        gridFsTemplate.delete(new Query());
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        return headers;
    }

    private ByteArrayResource createMetadataResource(String json) {
        return new ByteArrayResource(json.getBytes(StandardCharsets.UTF_8)) {
            @Override
            public String getFilename() {
                return "metadata.json";
            }
        };
    }

    @Test
    void shouldUploadPdfFile() {
        // Criando um arquivo PDF de teste
        byte[] pdfContent = "%PDF-1.4\n%Test PDF content".getBytes(StandardCharsets.UTF_8);
        ByteArrayResource fileResource = new ByteArrayResource(pdfContent) {
            @Override
            public String getFilename() {
                return "test-document.pdf";
            }
        };

        String metadataJson = """
                {
                  "title": "Documento de Teste",
                  "description": "Este é um documento PDF de teste",
                  "tags": ["teste", "pdf", "documento"]
                }
                """;

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", fileResource);
        body.add("metadata", createMetadataResource(metadataJson));

        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, createHeaders());

        ResponseEntity<FileUploadResponse> response = restTemplate.exchange(
                "http://localhost:" + port + "/api/files",
                HttpMethod.POST,
                entity,
                FileUploadResponse.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getHeaders().getLocation()).isNotNull();

        FileUploadResponse uploadResponse = response.getBody();
        assertThat(uploadResponse).isNotNull();
        assertThat(uploadResponse.getId()).isNotNull();
        assertThat(uploadResponse.getFilename()).isEqualTo("test-document.pdf");
        assertThat(uploadResponse.getContentType()).isEqualTo("application/pdf");
        assertThat(uploadResponse.getSize()).isGreaterThan(0);
    }

    @Test
    void shouldUploadExcelFile() {
        byte[] excelContent = "Mock Excel Content".getBytes(StandardCharsets.UTF_8);
        ByteArrayResource fileResource = new ByteArrayResource(excelContent) {
            @Override
            public String getFilename() {
                return "planilha-teste.xlsx";
            }
        };

        String metadataJson = """
                {
                  "title": "Planilha de Dados",
                  "description": "Planilha com dados de teste",
                  "tags": ["excel", "dados", "planilha"]
                }
                """;

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", fileResource);
        body.add("metadata", createMetadataResource(metadataJson));

        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, createHeaders());

        ResponseEntity<FileUploadResponse> response = restTemplate.exchange(
                "http://localhost:" + port + "/api/files",
                HttpMethod.POST,
                entity,
                FileUploadResponse.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        FileUploadResponse uploadResponse = response.getBody();
        assertThat(uploadResponse).isNotNull();
        assertThat(uploadResponse.getId()).isNotNull();
        assertThat(uploadResponse.getFilename()).isEqualTo("planilha-teste.xlsx");
        assertThat(uploadResponse.getContentType()).isEqualTo("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }

    @Test
    void shouldUploadTextFile() {
        byte[] textContent = "Este é um arquivo de texto de teste.\nCom múltiplas linhas.".getBytes(StandardCharsets.UTF_8);
        ByteArrayResource fileResource = new ByteArrayResource(textContent) {
            @Override
            public String getFilename() {
                return "notas.txt";
            }
        };

        String metadataJson = """
                {
                  "title": "Notas de Aula",
                  "description": "Anotações importantes",
                  "tags": ["texto", "notas", "aula"]
                }
                """;

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", fileResource);
        body.add("metadata", createMetadataResource(metadataJson));

        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, createHeaders());

        ResponseEntity<FileUploadResponse> response = restTemplate.exchange(
                "http://localhost:" + port + "/api/files",
                HttpMethod.POST,
                entity,
                FileUploadResponse.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        FileUploadResponse uploadResponse = response.getBody();
        assertThat(uploadResponse).isNotNull();
        assertThat(uploadResponse.getId()).isNotNull();
        assertThat(uploadResponse.getFilename()).isEqualTo("notas.txt");
        assertThat(uploadResponse.getContentType()).isEqualTo("text/plain");
    }

    @Test
    void shouldDownloadFile() {
        // Primeiro, faz o upload de um arquivo
        byte[] fileContent = "Conteúdo do arquivo para download".getBytes(StandardCharsets.UTF_8);
        ByteArrayResource fileResource = new ByteArrayResource(fileContent) {
            @Override
            public String getFilename() {
                return "download-test.txt";
            }
        };

        String metadataJson = """
                {
                  "title": "Arquivo para Download",
                  "description": "Teste de download",
                  "tags": ["download", "teste"]
                }
                """;

        MultiValueMap<String, Object> uploadBody = new LinkedMultiValueMap<>();
        uploadBody.add("file", fileResource);
        uploadBody.add("metadata", createMetadataResource(metadataJson));

        HttpEntity<MultiValueMap<String, Object>> uploadEntity = new HttpEntity<>(uploadBody, createHeaders());

        ResponseEntity<FileUploadResponse> uploadResponse = restTemplate.exchange(
                "http://localhost:" + port + "/api/files",
                HttpMethod.POST,
                uploadEntity,
                FileUploadResponse.class
        );

        assertThat(uploadResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        String fileId = uploadResponse.getBody().getId();

        // Agora faz o download
        ResponseEntity<Resource> downloadResponse = restTemplate.exchange(
                "http://localhost:" + port + "/api/files/" + fileId,
                HttpMethod.GET,
                null,
                Resource.class
        );

        assertThat(downloadResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(downloadResponse.getHeaders().getContentType()).isNotNull();
        assertThat(downloadResponse.getHeaders().getFirst(HttpHeaders.CONTENT_DISPOSITION))
                .contains("attachment")
                .contains("download-test.txt");
        assertThat(downloadResponse.getBody()).isNotNull();
    }

    @Test
    void shouldListAllFiles() {
        // Upload de múltiplos arquivos
        uploadTestFile("arquivo1.pdf", "application/pdf", "Primeiro Arquivo", "Descrição 1", List.of("tag1", "tag2"));
        uploadTestFile("arquivo2.txt", "text/plain", "Segundo Arquivo", "Descrição 2", List.of("tag2", "tag3"));
        uploadTestFile("arquivo3.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Terceiro Arquivo", "Descrição 3", List.of("tag1", "tag3"));

        // Lista todos os arquivos
        ResponseEntity<Map> response = restTemplate.exchange(
                "http://localhost:" + port + "/api/files",
                HttpMethod.GET,
                null,
                Map.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        Map<String, Object> pageResponse = response.getBody();
        assertThat(pageResponse).isNotNull();
        assertThat(pageResponse.get("content")).isNotNull();

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> files = (List<Map<String, Object>>) pageResponse.get("content");
        assertThat(files).hasSizeGreaterThanOrEqualTo(3);

        for (Map<String, Object> file : files) {
            assertThat(file.get("id")).isNotNull();
            assertThat(file.get("filename")).isNotNull();
            assertThat(file.get("title")).isNotNull();
        }
    }

    @Test
    void shouldListFilesWithTitleFilter() {
        uploadTestFile("relatorio.pdf", "application/pdf", "Relatório Anual", "Relatório do ano", List.of("relatorio"));
        uploadTestFile("planilha.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Planilha de Vendas", "Vendas mensais", List.of("vendas"));

        ResponseEntity<Map> response = restTemplate.exchange(
                "http://localhost:" + port + "/api/files?title=Relatório",
                HttpMethod.GET,
                null,
                Map.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        @SuppressWarnings("unchecked")
        Map<String, Object> pageResponse = (Map<String, Object>) response.getBody();
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> files = (List<Map<String, Object>>) pageResponse.get("content");

        assertThat(files).isNotEmpty();
        assertThat(files.get(0).get("title").toString()).containsIgnoringCase("Relatório");
    }

    @Test
    void shouldListFilesWithFileTypeFilter() {
        uploadTestFile("documento.pdf", "application/pdf", "Documento PDF", "Um PDF", List.of("pdf"));
        uploadTestFile("texto.txt", "text/plain", "Arquivo Texto", "Um TXT", List.of("txt"));

        ResponseEntity<Map> response = restTemplate.exchange(
                "http://localhost:" + port + "/api/files?fileType=PDF",
                HttpMethod.GET,
                null,
                Map.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        @SuppressWarnings("unchecked")
        Map<String, Object> pageResponse = (Map<String, Object>) response.getBody();
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> files = (List<Map<String, Object>>) pageResponse.get("content");

        assertThat(files).isNotEmpty();
        files.forEach(file -> {
            assertThat(file.get("fileType").toString()).isEqualTo("PDF");
        });
    }

    @Test
    void shouldListFilesWithTagsFilter() {
        uploadTestFile("file1.pdf", "application/pdf", "File 1", "Desc 1", List.of("importante", "urgente"));
        uploadTestFile("file2.txt", "text/plain", "File 2", "Desc 2", List.of("normal"));
        uploadTestFile("file3.pdf", "application/pdf", "File 3", "Desc 3", List.of("importante"));

        ResponseEntity<Map> response = restTemplate.exchange(
                "http://localhost:" + port + "/api/files?tags=importante",
                HttpMethod.GET,
                null,
                Map.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        @SuppressWarnings("unchecked")
        Map<String, Object> pageResponse = (Map<String, Object>) response.getBody();
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> files = (List<Map<String, Object>>) pageResponse.get("content");

        assertThat(files).hasSizeGreaterThanOrEqualTo(2);
    }

    @Test
    void shouldListFilesWithPagination() {
        // Upload de vários arquivos para testar paginação
        for (int i = 1; i <= 5; i++) {
            uploadTestFile("file" + i + ".txt", "text/plain", "File " + i, "Description " + i, List.of("test"));
        }

        ResponseEntity<Map> response = restTemplate.exchange(
                "http://localhost:" + port + "/api/files?page=0&size=2",
                HttpMethod.GET,
                null,
                Map.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        @SuppressWarnings("unchecked")
        Map<String, Object> pageResponse = (Map<String, Object>) response.getBody();
        assertThat(pageResponse).isNotNull();
        assertThat(pageResponse.get("size")).isEqualTo(2);
        assertThat(pageResponse.get("totalElements")).isNotNull();

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> files = (List<Map<String, Object>>) pageResponse.get("content");
        assertThat(files).hasSize(2);
    }

    @Test
    void shouldDeleteFile() {
        // Upload de um arquivo
        byte[] fileContent = "Arquivo para deletar".getBytes(StandardCharsets.UTF_8);
        ByteArrayResource fileResource = new ByteArrayResource(fileContent) {
            @Override
            public String getFilename() {
                return "delete-test.txt";
            }
        };

        String metadataJson = """
                {
                  "title": "Arquivo para Deletar",
                  "description": "Será deletado",
                  "tags": ["delete", "test"]
                }
                """;

        MultiValueMap<String, Object> uploadBody = new LinkedMultiValueMap<>();
        uploadBody.add("file", fileResource);
        uploadBody.add("metadata", createMetadataResource(metadataJson));

        HttpEntity<MultiValueMap<String, Object>> uploadEntity = new HttpEntity<>(uploadBody, createHeaders());

        ResponseEntity<FileUploadResponse> uploadResponse = restTemplate.exchange(
                "http://localhost:" + port + "/api/files",
                HttpMethod.POST,
                uploadEntity,
                FileUploadResponse.class
        );

        assertThat(uploadResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        String fileId = uploadResponse.getBody().getId();

        ResponseEntity<Void> deleteResponse = restTemplate.exchange(
                "http://localhost:" + port + "/api/files/" + fileId,
                HttpMethod.DELETE,
                null,
                Void.class
        );

        assertThat(deleteResponse.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

        ResponseEntity<Resource> downloadResponse = restTemplate.exchange(
                "http://localhost:" + port + "/api/files/" + fileId,
                HttpMethod.GET,
                null,
                Resource.class
        );

        assertThat(downloadResponse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void shouldRejectUploadWithoutTitle() {
        byte[] fileContent = "Test content".getBytes(StandardCharsets.UTF_8);
        ByteArrayResource fileResource = new ByteArrayResource(fileContent) {
            @Override
            public String getFilename() {
                return "test.txt";
            }
        };

        String metadataJson = """
                {
                  "description": "Sem título",
                  "tags": ["test"]
                }
                """;

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", fileResource);
        body.add("metadata", createMetadataResource(metadataJson));

        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, createHeaders());

        ResponseEntity<String> response = restTemplate.exchange(
                "http://localhost:" + port + "/api/files",
                HttpMethod.POST,
                entity,
                String.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void shouldRejectUnsupportedFileType() {
        byte[] fileContent = "Unsupported content".getBytes(StandardCharsets.UTF_8);
        ByteArrayResource fileResource = new ByteArrayResource(fileContent) {
            @Override
            public String getFilename() {
                return "test.unsupported";
            }
        };

        String metadataJson = """
                {
                  "title": "Arquivo Não Suportado",
                  "description": "Tipo não suportado",
                  "tags": ["test"]
                }
                """;

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", fileResource);
        body.add("metadata", createMetadataResource(metadataJson));

        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, createHeaders());

        ResponseEntity<String> response = restTemplate.exchange(
                "http://localhost:" + port + "/api/files",
                HttpMethod.POST,
                entity,
                String.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void shouldReturnNotFoundForNonExistentFile() {
        String fakeFileId = "507f1f77bcf86cd799439011";

        ResponseEntity<Resource> response = restTemplate.exchange(
                "http://localhost:" + port + "/api/files/" + fakeFileId,
                HttpMethod.GET,
                null,
                Resource.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    // Método auxiliar para upload de arquivos de teste
    private void uploadTestFile(String filename, String contentType, String title, String description, List<String> tags) {
        byte[] fileContent = ("Content of " + filename).getBytes(StandardCharsets.UTF_8);
        ByteArrayResource fileResource = new ByteArrayResource(fileContent) {
            @Override
            public String getFilename() {
                return filename;
            }
        };

        String tagsJson = tags.stream()
                .map(tag -> "\"" + tag + "\"")
                .reduce((a, b) -> a + ", " + b)
                .orElse("");

        String metadataJson = String.format("""
                {
                  "title": "%s",
                  "description": "%s",
                  "tags": [%s]
                }
                """, title, description, tagsJson);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", fileResource);
        body.add("metadata", createMetadataResource(metadataJson));

        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, createHeaders());

        restTemplate.exchange(
                "http://localhost:" + port + "/api/files",
                HttpMethod.POST,
                entity,
                FileUploadResponse.class
        );
    }
}

