// RabbitMQWrapper.ts
import amqp, { Channel, Connection, Options } from 'amqplib';


interface RabbitMQConfig {
  exchangeName: string;
  exchangeType?: string; // Default to 'topic'
  exchangeOptions?: Options.AssertExchange; // Exchange-specific options
  defaultQueueOptions?: Options.AssertQueue; // Default queue options
}


class RabbitMQWrapper {
  private _connection?: Connection;
  private _channel?: Channel;
  private config: RabbitMQConfig;
  private urls: string[];

  constructor(config: RabbitMQConfig, urls: string[]) {
    this.config = {
      exchangeType: 'topic', // Default to topic exchange
      exchangeOptions: { durable: true }, // Default options
      defaultQueueOptions: { durable: true, autoDelete: false },
      ...config,
    };
    this.urls = urls;

    process.on('SIGINT', () => this.closeGracefully());
    process.on('SIGTERM', () => this.closeGracefully());
  }

  get channel() {
    if (!this._channel) {
      throw new Error('Cannot access RabbitMQ channel before connecting');
    }
    return this._channel;
  }



  async connect(): Promise<void> {
    for (const url of this.urls) {
      try {
        this._connection = await amqp.connect(url);
        this._channel = await this._connection.createChannel();

        // Assert the exchange with the provided type and options
        await this._channel.assertExchange(
          this.config.exchangeName,
          this.config.exchangeType || 'topic',
          this.config.exchangeOptions
        );

        console.log(`Connected to RabbitMQ at ${url} and exchange ${this.config.exchangeName} created`);

        // Handle connection closure and attempt reconnection
        this._connection.on('close', () => {
          console.log('RabbitMQ connection closed, reconnecting...');
          this.reconnect();
        });
        return; // Exit the loop if connection succeeds
      } catch (error) {
        console.error(`Failed to connect to RabbitMQ at ${url}:`, error);
      }
    }

    // If none of the URLs were successful, throw an error
    throw new Error('Could not connect to any RabbitMQ servers.');
  }

  private async reconnect(): Promise<void> {
    try {
      await this.connect();
    } catch (error) {
      console.error('Reconnect attempt failed:', error);
      setTimeout(() => this.reconnect(), 5000);
    }
  }

  get defaultQueueOptions(): Options.AssertQueue {
    return this.config.defaultQueueOptions || {};
  }


  private async closeGracefully() {
    console.log('Gracefully shutting down...');
    try {
      await this._channel?.close();
      await this._connection?.close();
      console.log('RabbitMQ connection closed gracefully');
      process.exit(0);
    } catch (error) {
      console.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  }

  async close(): Promise<void> {
    await this._connection?.close();
  }
}

export const rabbitMQWrapper = new RabbitMQWrapper({
  exchangeName: 'event_bus_exchange',
  exchangeType: 'topic',
  
}, ["amqp://emerald-cdw-rabbitmq"]);
