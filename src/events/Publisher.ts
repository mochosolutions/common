// Publisher.ts
import { Channel, Options } from 'amqplib';
import { rabbitMQWrapper } from './RabbitMQWrapper';
import { Event } from './events';


export abstract class Publisher<T extends Event> {
  abstract subject: string; // Routing key for the message
  private exchangeName: string;
  private publishOptions: Options.Publish

  constructor(exchangeName: string, publishOptions: Options.Publish = {}) {
    this.exchangeName = exchangeName;
    this.publishOptions = publishOptions;
  }

  async publish(data: T['data']): Promise<void> {
    const message = JSON.stringify(data);
    const channel = rabbitMQWrapper.channel;

    channel.publish(this.exchangeName, this.subject, Buffer.from(message), this.publishOptions);
    console.log(`Event published to exchange "${this.exchangeName}" with routing key "${this.subject}" and data:`, data);
  }
}



// export abstract class Publisher<T extends Event> {
//   abstract subject: string; // Routing key for the message
//   private exchangeName: string;
//   private publishOptions: Options.Publish;

//   constructor(exchangeName: string, publishOptions: Options.Publish = {}) {
//     this.exchangeName = exchangeName;
//     this.publishOptions = publishOptions;
//   }

//   async publish(data: T['data']): Promise<void> {
//     const message = JSON.stringify(data);

//     try {
//       const channel = await this.getChannel();
//       channel.publish(this.exchangeName, this.subject, Buffer.from(message), this.publishOptions);

//       // Centralized logging
//       console.log(`[Publisher] Event published: ${this.subject}`, {
//         exchange: this.exchangeName,
//         data,
//       });
//     } catch (error) {
//       console.error(`[Publisher] Failed to publish event: ${this.subject}`, error);
//       // Optionally rethrow or handle errors as per application requirements
//       throw new Error(`Failed to publish event: ${error.message}`);
//     }
//   }

//   // Get channel with automatic recovery
//   private async getChannel(): Promise<Channel> {
//     if (!rabbitMQWrapper.channel) {
//       console.warn('[Publisher] Channel is unavailable. Attempting to recreate...');
//       await rabbitMQWrapper.connect(); // Logic to reconnect and recreate the channel
//     }
//     return rabbitMQWrapper.channel!;
//   }
// }