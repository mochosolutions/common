// Listener.ts
import { Channel, ConsumeMessage, Options } from 'amqplib';
import { Event } from './events';
import { rabbitMQWrapper } from './RabbitMQWrapper';

interface ListenerOptions {
    queueOptions?: Options.AssertQueue;
    consumeOptions?: Options.Consume;
}
  
  export abstract class Listener<T extends Event> {
    abstract subject: string;        // Routing key (e.g., 'job.created')
    abstract queueGroupName: string; // Queue group name for this type of listener
    abstract onMessage(data: T['data'], msg: ConsumeMessage): void;
  
    private exchangeName: string;
    protected channel: Channel;
    private options: ListenerOptions;
  
    constructor(exchangeName: string, options: ListenerOptions = {}) {
      this.exchangeName = exchangeName;
      this.options = options;
      this.channel = rabbitMQWrapper.channel;
    }
  
    async listen(): Promise<void> {
      // Assert the queue with specified options (default: durable)

      const queueOptions = { 
        ...rabbitMQWrapper.defaultQueueOptions, 
        ...this.options.queueOptions 
      };

      await this.channel.assertQueue(this.queueGroupName, queueOptions);
      await this.channel.bindQueue(this.queueGroupName, this.exchangeName, this.subject);
  
      // Start consuming messages with the provided consume options
      this.channel.consume(
        this.queueGroupName,
        (msg) => {
          if (msg) {
            console.log(`Message received on subject "${this.subject}" in queue "${this.queueGroupName}"`);
            const data = JSON.parse(msg.content.toString()) as T['data'];
            this.onMessage(data, msg);
            this.channel.ack(msg);
          }
        },
        this.options.consumeOptions
      );
    }
  }