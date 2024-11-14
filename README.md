# 🍽 Sistema de Gerenciamento de Refeições

Este projeto implementa uma API de gerenciamento de refeições com autenticação baseada em sessões, desenvolvida usando o framework **Fastify** e o banco de dados **Knex**. O sistema permite que os usuários registrem refeições, visualizem suas refeições e obtenham informações de progresso em relação a uma dieta. Desafio - RocketSeat

## 📋 Funcionalidades

1. **Cadastro de Clientes**: Permite o cadastro de novos clientes, criando uma sessão exclusiva para cada cliente.
2. **Gerenciamento de Refeições**: Permite que os clientes registrem refeições, com detalhes sobre o nome, descrição, data, hora e status da dieta (dentro ou fora da dieta).
3. **Consultas de Refeições e Dados Estatísticos**: O cliente pode visualizar todas as suas refeições e dados de progresso sobre a dieta, incluindo a maior sequência de dias consecutivos dentro da dieta e o número de refeições dentro e fora da dieta.

---

## 🚀 Endpoints

### 1. `clientsRoutes`

#### POST `/`
- **Descrição**: Endpoint para o cadastro de um novo cliente. Ao se cadastrar, o cliente recebe um `sessionId` exclusivo armazenado como um cookie para autenticação nas próximas requisições.
- **Requisição**:
  - **Corpo**:
    ```json
    {
      "name": "Nome do Cliente"
    }
    ```
- **Resposta**:
  - **Status**: `201 Created`

---

### 2. `mealsRoutes`

#### POST `/`
- **Descrição**: Registra uma nova refeição para o usuário autenticado. O status da dieta da refeição pode ser definido como "dentro da dieta" (`on-diet`) ou "fora da dieta" (`off-diet`).
- **Requisição**:
  - **Cookie**: `sessionId`
  - **Corpo**:
    ```json
    {
      "name": "Nome da Refeição",
      "description": "Descrição da Refeição (opcional, até 500 caracteres)",
      "date": "YYYY-MM-DD",
      "time": "HH:MM ou HH:MM:SS",
      "status": "on-diet" | "off-diet"
    }
    ```
- **Resposta**:
  - **Status**: `201 Created`

---

#### GET `/`
- **Descrição**: Retorna todas as refeições do usuário autenticado, juntamente com o nome do usuário.
- **Requisição**:
  - **Cookie**: `sessionId`
- **Resposta**:
  - **Status**: `200 OK`
  - **Exemplo**:
    ```json
    {
      "name": "Nome do Cliente",
      "meals": [
        {
          "id": "UUID da Refeição",
          "name": "Nome da Refeição",
          "description": "Descrição",
          "date": "YYYY-MM-DD",
          "time": "HH:MM:SS",
          "status": "on-diet"
        }
      ]
    }
    ```

---

#### GET `/:id`
- **Descrição**: Retorna os detalhes de uma refeição específica com base no `id` fornecido, apenas se a refeição pertencer ao usuário autenticado.
- **Requisição**:
  - **Cookie**: `sessionId`
  - **Parâmetro de URL**: `id` (UUID da refeição)
- **Resposta**:
  - **Status**: `200 OK` ou `404 Not Found` se a refeição não for encontrada ou pertencer a outro usuário.
  - **Exemplo**:
    ```json
    {
      "name": "Nome do Cliente",
      "meal": {
        "id": "UUID da Refeição",
        "name": "Nome da Refeição",
        "description": "Descrição",
        "date": "YYYY-MM-DD",
        "time": "HH:MM:SS",
        "status": "on-diet"
      }
    }
    ```

---

#### GET `/data`
- **Descrição**: Retorna estatísticas de dieta do usuário autenticado, incluindo a maior sequência de refeições "dentro da dieta", o número de refeições dentro e fora da dieta e o total de refeições registradas.
- **Requisição**:
  - **Cookie**: `sessionId`
- **Resposta**:
  - **Status**: `200 OK`
  - **Exemplo**:
    ```json
    {
      "name": "Nome do Cliente",
      "biggestSequence": 5,
      "on": 10,
      "off": 3,
      "total": 13
    }
    ```

---

## 🛠 Pré-requisitos

- Node.js
- Banco de Dados configurado e acessível pelo Knex

## ▶️ Como Executar

1. Clone o repositório.
2.Instale as dependências:
   ```bash
   npm i
3. Execute as migrations:
   ```bash
   knex migrate:latest
4. Inicie o servidor:
   ```bash
   npm run dev
