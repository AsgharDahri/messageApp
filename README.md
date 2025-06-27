
## How to install ?

1. Clone the repository
2. Run npm install
3. Configure Env [ Kafka, Elastic Search, DB_URL, Elastic Password, System Port ]
4. npm run start:dev
5. For APIs: Import collection to postman from root foler [ MessageApp.postman_collection.json ]



## System Architecture Diagram

```mermaid
graph TB
    %% Client Layer
    Client[Client Applications] --> API[API Gateway/REST Endpoints]
    
    %% Application Layer
    API --> Controller[Messages Controller]
    Controller --> Service[Messages Service]
    
    %% Data Layer
    Service --> MongoDB[(MongoDB Database)]
    Service --> Elasticsearch[(Elasticsearch)]
    Service --> Kafka[Apache Kafka]
    
    %% External Services
    Kafka --> Consumer[Kafka Consumers]
    Elasticsearch --> Search[Search Engine]
    
    %% Configuration
    Config[Configuration Module] --> Service
    Config --> MongoDB
    Config --> Elasticsearch
    Config --> Kafka
    
    %% Styling
    classDef clientLayer fill:#e1f5fe
    classDef appLayer fill:#f3e5f5
    classDef dataLayer fill:#e8f5e8
    classDef configLayer fill:#fff3e0
    
    class Client,API clientLayer
    class Controller,Service appLayer
    class MongoDB,Elasticsearch,Kafka,Consumer,Search dataLayer
    class Config configLayer
```



## Data Flow

### Message Creation Flow
```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Service
    participant MongoDB
    participant Elasticsearch
    participant Kafka
    
    Client->>Controller: POST /api/messages
    Controller->>Service: createMessage(dto)
    Service->>MongoDB: Save message
    Service->>Elasticsearch: Index message
    Service->>Kafka: Emit message event
    Service->>Controller: Return success response
    Controller->>Client: HTTP 200 OK
```

### Message Retrieval Flow
```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Service
    participant MongoDB
    
    Client->>Controller: GET /api/conversations/:id/messages
    Controller->>Service: getMessagesPaginated()
    Service->>MongoDB: Query messages with pagination
    MongoDB->>Service: Return messages
    Service->>Controller: Return paginated response
    Controller->>Client: HTTP 200 OK with data
```

### Message Search Flow
```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Service
    participant Elasticsearch
    
    Client->>Controller: GET /api/conversations/:id/messages/search?q=query
    Controller->>Service: searchMessages(conversationId, query)
    Service->>Elasticsearch: Search messages
    Elasticsearch->>Service: Return search results
    Service->>Controller: Return search response
    Controller->>Client: HTTP 200 OK with results
```
## 🛠️ Tech Stack

- **NestJS**, **TypeScript** – Backend framework  
- **MongoDB**, **Mongoose** – Data storage  
- **Elasticsearch** – Full-text search  
- **Kafka**, **KafkaJS** – Real-time messaging  
- **@nestjs/config** – Env config

---

## 📦 Modules

- **AppModule** – Root config & imports  
- **MessagesModule** – APIs, logic, Mongo schema  
- **KafkaModule** – Kafka setup & messaging  
- **ElasticsearchModule** – Search/indexing  
- **DatabaseModule** – MongoDB connection

---

## 🔌 API Endpoints

- `POST /api/messages` – Create + store + index + publish  
- `GET /api/conversations/:id/messages` – Paginated fetch  
- `GET /api/conversations/:id/messages/search?q=` – Full-text search
