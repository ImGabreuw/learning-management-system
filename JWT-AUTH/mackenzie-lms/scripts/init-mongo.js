// scripts/init-mongo.js
// Script de inicialização do MongoDB para o Mackenzie LMS

print('🚀 Iniciando configuração do banco de dados Mackenzie LMS...');

// Selecionar base de dados
db = db.getSiblingDB('mackenzie_lms');

// Criar índices únicos
print('📊 Criando índices únicos...');

db.users.createIndex({ "email": 1 }, {
    unique: true,
    name: "idx_users_email_unique",
    background: true
});

db.roles.createIndex({ "name": 1 }, {
    unique: true,
    name: "idx_roles_name_unique",
    background: true
});

// Índices adicionais para performance
db.users.createIndex({ "createdAt": 1 }, {
    name: "idx_users_created_at",
    background: true
});

db.users.createIndex({ "lastLogin": 1 }, {
    name: "idx_users_last_login",
    background: true
});

print('✅ Índices criados com sucesso!');

// Inserir roles padrão
print('👥 Inserindo roles padrão...');

const roles = [
    {
        "_id": ObjectId(),
        "name": "ADMIN",
        "description": "Administrador do sistema com acesso total",
        "createdAt": new Date()
    },
    {
        "_id": ObjectId(),
        "name": "PROFESSOR",
        "description": "Professor com acesso a funcionalidades de ensino",
        "createdAt": new Date()
    },
    {
        "_id": ObjectId(),
        "name": "ALUNO",
        "description": "Aluno com acesso básico do estudante",
        "createdAt": new Date()
    }
];

try {
    db.roles.insertMany(roles);
    print('✅ Roles inseridas com sucesso!');
} catch (e) {
    if (e.code === 11000) {
        print('⚠️  Roles já existem, pulando inserção...');
    } else {
        print('❌ Erro ao inserir roles:', e);
    }
}

// Criar usuário administrador padrão (se não existir)
print('🔧 Criando usuário administrador padrão...');

const adminRole = db.roles.findOne({ "name": "ADMIN" });
if (!adminRole) {
    print('❌ Role ADMIN não encontrada!');
} else {
    const adminUser = {
        "_id": ObjectId(),
        "email": "admin@mackenzie.br",
        "password": "$2a$10$dXJ3SW6G7P4pNJG8.YCVOeO9/5s2/W8S8z8K8K8K8K8K8K8K8K8K8", // senha: admin123
        "firstName": "Administrador",
        "lastName": "Sistema",
        "roles": [adminRole],
        "enabled": true,
        "accountNonExpired": true,
        "credentialsNonExpired": true,
        "accountNonLocked": true,
        "createdAt": new Date(),
        "lastLogin": null
    };

    try {
        const existingAdmin = db.users.findOne({ "email": "admin@mackenzie.br" });
        if (!existingAdmin) {
            db.users.insertOne(adminUser);
            print('✅ Usuário administrador criado com sucesso!');
            print('📧 Email: admin@mackenzie.br');
            print('🔐 Senha: admin123');
            print('⚠️  IMPORTANTE: Altere a senha padrão após o primeiro login!');
        } else {
            print('⚠️  Usuário administrador já existe, pulando criação...');
        }
    } catch (e) {
        print('❌ Erro ao criar usuário administrador:', e);
    }
}

// Criar coleções adicionais com validação
print('📁 Criando coleções adicionais...');

// Coleção para disciplinas
db.createCollection("disciplinas", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["nome", "codigo", "professorId", "createdAt"],
            properties: {
                nome: {
                    bsonType: "string",
                    description: "Nome da disciplina é obrigatório"
                },
                codigo: {
                    bsonType: "string",
                    description: "Código da disciplina é obrigatório"
                },
                professorId: {
                    bsonType: "string",
                    description: "ID do professor é obrigatório"
                }
            }
        }
    }
});

// Coleção para arquivos
db.createCollection("arquivos", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["nome", "tipo", "tamanho", "disciplinaId", "uploadedBy", "createdAt"],
            properties: {
                nome: {
                    bsonType: "string",
                    description: "Nome do arquivo é obrigatório"
                },
                tipo: {
                    bsonType: "string",
                    description: "Tipo do arquivo é obrigatório"
                }
            }
        }
    }
});

// Coleção para oportunidades
db.createCollection("oportunidades", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["titulo", "tipo", "createdBy", "createdAt"],
            properties: {
                titulo: {
                    bsonType: "string",
                    description: "Título da oportunidade é obrigatório"
                },
                tipo: {
                    bsonType: "string",
                    enum: ["ESTAGIO", "COMPLEMENTAR", "EXTENSAO"],
                    description: "Tipo deve ser ESTAGIO, COMPLEMENTAR ou EXTENSAO"
                }
            }
        }
    }
});

print('✅ Coleções criadas com sucesso!');

// Criar índices adicionais para performance
print('🔍 Criando índices adicionais para performance...');

// Índices para disciplinas
db.disciplinas.createIndex({ "codigo": 1 }, { unique: true, background: true });
db.disciplinas.createIndex({ "professorId": 1 }, { background: true });
db.disciplinas.createIndex({ "createdAt": 1 }, { background: true });

// Índices para arquivos
db.arquivos.createIndex({ "disciplinaId": 1 }, { background: true });
db.arquivos.createIndex({ "uploadedBy": 1 }, { background: true });
db.arquivos.createIndex({ "createdAt": 1 }, { background: true });

// Índices para oportunidades
db.oportunidades.createIndex({ "tipo": 1 }, { background: true });
db.oportunidades.createIndex({ "createdBy": 1 }, { background: true });
db.oportunidades.createIndex({ "tags": 1 }, { background: true });
db.oportunidades.createIndex({ "createdAt": 1 }, { background: true });

print('✅ Índices de performance criados!');

// Inserir dados de exemplo para desenvolvimento (apenas se não existirem)
if (db.disciplinas.countDocuments() === 0);