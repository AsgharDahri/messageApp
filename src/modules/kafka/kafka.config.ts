export const kafkaConfig = {
  clientId: 'message-app',
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
  topic: {
    messageCreated: 'message.created',
  },
}; 