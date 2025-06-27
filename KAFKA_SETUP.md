# Kafka Setup for Message App

This document describes the simple Kafka configuration for publishing message events.

## Configuration

The Kafka configuration is centralized in `src/kafka/kafka.config.ts`:

- **Client ID**: `message-app`
- **Brokers**: Defaults to `localhost:9092`, can be configured via `KAFKA_BROKERS` environment variable
- **Topics**: 
  - `message.created` - Published when a new message is created

## Environment Variables

Add these to your `.env` file:

```env
KAFKA_BROKERS=localhost:9092
```

For multiple brokers, use comma-separated values:
```env
KAFKA_BROKERS=localhost:9092,localhost:9093,localhost:9094
```

## Running Kafka Locally

### Option 1: Direct Installation (Recommended)

1. **Download Kafka**:
   - Go to [Apache Kafka Downloads](https://kafka.apache.org/download)
   - Download the latest version (e.g., `kafka_2.13-3.6.1.tgz`)
   - Extract to `C:\kafka` (Windows) or `/opt/kafka` (Linux/Mac)

2. **Start Zookeeper** (required for Kafka):
   ```bash
   # Windows
   C:\kafka\bin\windows\zookeeper-server-start.bat C:\kafka\config\zookeeper.properties
   
   # Linux/Mac
   /opt/kafka/bin/zookeeper-server-start.sh /opt/kafka/config/zookeeper.properties
   ```

3. **Start Kafka Broker**:
   ```bash
   # Windows
   C:\kafka\bin\windows\kafka-server-start.bat C:\kafka\config\server.properties
   
   # Linux/Mac
   /opt/kafka/bin/kafka-server-start.sh /opt/kafka/config/server.properties
   ```

4. **Use the provided script** (Windows):
   ```bash
   # Update KAFKA_HOME in start-kafka.bat first
   start-kafka.bat
   ```

### Option 2: Cloud Services (Free Tiers)

#### Confluent Cloud
1. Sign up at [Confluent Cloud](https://www.confluent.io/confluent-cloud/)
2. Create a free cluster
3. Update your config with the provided broker endpoints

#### Upstash Kafka
1. Sign up at [Upstash](https://upstash.com/)
2. Create a Kafka cluster
3. Use their provided broker endpoints

### Option 3: WSL2 (Windows)
```bash
# Install Java
sudo apt update
sudo apt install openjdk-11-jdk

# Download and extract Kafka
wget https://downloads.apache.org/kafka/3.6.1/kafka_2.13-3.6.1.tgz
tar -xzf kafka_2.13-3.6.1.tgz
cd kafka_2.13-3.6.1

# Start Zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties

# In another terminal, start Kafka
bin/kafka-server-start.sh config/server.properties
```

### Option 4: Redpanda (Kafka-compatible)
1. Download from [Redpanda](https://redpanda.com/download)
2. Run: `redpanda start`
3. Your existing code will work without changes

## Usage

When a message is created via the `MessagesService.createMessage()` method, it will:

1. Save the message to MongoDB
2. Publish a `message.created` event to Kafka with the message data

## Event Structure

The `message.created` event contains:
```json
{
  "id": "message_id",
  "conversationId": "conversation_id", 
  "senderId": "sender_id",
  "content": "message_content",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Testing

The Kafka service will log connection status and message publishing events to the console.

### Verify Kafka is Running
```bash
# List topics (should show message.created after first message)
C:\kafka\bin\windows\kafka-topics.bat --list --bootstrap-server localhost:9092

# Consume messages to test
C:\kafka\bin\windows\kafka-console-consumer.bat --topic message.created --from-beginning --bootstrap-server localhost:9092
``` 