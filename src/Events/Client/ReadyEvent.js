import EventMap from '../../Structure/EventMap.js';
import '../../Utils/Functions/createMosaic.js';

export default class extends EventMap {
  constructor(client) {
    super(client, {
      name: 'ready',
      once: true
    });
  }
  run = async () => {
    await this.client.registerCommands();
    this.log(`O client ${`${this.client.user.tag}`.blue} ${`(${this.client.user.id})`.blue} foi iniciado com êxito!`, 'client');
  };
};