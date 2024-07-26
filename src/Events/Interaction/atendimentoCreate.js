import EventMap from '../../Structure/EventMap.js';
import '../../Utils/Functions/replaceTranscript.js';
import TicketEvent from '../../Utils/Styles/StyleTicketEvent.js';

export default class extends EventMap {
  constructor(client) {
    super(client, {
      name: 'interactionCreate'
    });
  }

  run = async (interaction) => {
    const Style = new TicketEvent({ interaction, client: this.client, firebase: this.firebase });

    if (interaction.isStringSelectMenu() && interaction.customId === 'atendimento') {
      await Style.createTicket();
    } else if (interaction.isButton()) {
      const db = (await this.firebase.ref(`Tickets/${interaction.guildId}/${interaction.channelId}`).once('value')).val();

      const buttonActions = {
        'fechar-ticket': Style.closeTicket.bind(Style, db),
        'ticket-transcript': Style.createTranscript.bind(Style, db),
        'ticket-reopen': Style.reopenTicket.bind(Style, db),
        'ticket-confirm': Style.confirmTicket.bind(Style),
        'ticket-delete': Style.deleteTicket.bind(Style),
        'cancelar-ticket': Style.cancelTicket.bind(Style)
      };

      const customId = interaction.customId;
      if (buttonActions[customId]) {
        buttonActions[customId]();
      }
    }
  }
}
