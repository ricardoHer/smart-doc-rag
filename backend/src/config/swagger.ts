import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import type { Express } from 'express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SmartDocRAG API',
            version: '1.0.0',
            description: 'API para sistema RAG (Retrieval-Augmented Generation) que permite upload, processamento e consulta inteligente de documentos',
            contact: {
                name: 'SmartDocRAG Team',
                email: 'support@smartdocrag.com'
            }
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production' ? 'https://api.smartdocrag.com' : 'http://localhost:3000',
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
            }
        ],
        tags: [
            {
                name: 'Upload',
                description: 'Operações de upload de arquivos'
            },
            {
                name: 'Document Processing',
                description: 'Processamento e ingestão de documentos'
            },
            {
                name: 'Documents',
                description: 'Gerenciamento de documentos armazenados'
            },
            {
                name: 'Query',
                description: 'Consultas RAG (Retrieval-Augmented Generation)'
            }
        ],
        components: {
            schemas: {
                Document: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único do documento'
                        },
                        name: {
                            type: 'string',
                            description: 'Nome do documento'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de criação do documento'
                        }
                    }
                },
                DocumentSummary: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único do documento'
                        },
                        name: {
                            type: 'string',
                            description: 'Nome do documento'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de criação do documento'
                        },
                        chunks_count: {
                            type: 'string',
                            description: 'Número de chunks do documento'
                        }
                    }
                },
                Chunk: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único do chunk'
                        },
                        document_id: {
                            type: 'integer',
                            description: 'ID do documento pai'
                        },
                        content: {
                            type: 'string',
                            description: 'Conteúdo do chunk de texto'
                        },
                        embedding: {
                            type: 'array',
                            items: {
                                type: 'number'
                            },
                            description: 'Vetor de embedding do chunk'
                        }
                    }
                },
                UploadResponse: {
                    type: 'object',
                    properties: {
                        fileName: {
                            type: 'string',
                            description: 'Nome original do arquivo'
                        },
                        content: {
                            type: 'string',
                            description: 'Conteúdo extraído do arquivo'
                        }
                    }
                },
                IngestRequest: {
                    type: 'object',
                    required: ['name', 'content'],
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Nome do documento',
                            example: 'Manual do Produto'
                        },
                        content: {
                            type: 'string',
                            description: 'Conteúdo do documento para processar',
                            example: 'Este é o conteúdo do documento que será processado em chunks...'
                        }
                    }
                },
                IngestResponse: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Mensagem de sucesso'
                        },
                        documentId: {
                            type: 'integer',
                            description: 'ID do documento criado'
                        },
                        chunks: {
                            type: 'integer',
                            description: 'Número de chunks gerados'
                        }
                    }
                },
                QueryRequest: {
                    type: 'object',
                    required: ['question'],
                    properties: {
                        question: {
                            type: 'string',
                            description: 'Pergunta a ser respondida baseada nos documentos',
                            example: 'Como funciona o sistema de pagamento?'
                        }
                    }
                },
                QueryResponse: {
                    type: 'object',
                    properties: {
                        answer: {
                            type: 'string',
                            description: 'Resposta gerada pela IA baseada no contexto'
                        },
                        contextUsed: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Primeiros 100 caracteres de cada chunk utilizado como contexto'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Mensagem de erro'
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.ts'], // Caminho para os arquivos de rota
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'SmartDocRAG API Documentation'
    }));

    // Endpoint para obter a especificação JSON
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });
}

export { specs };