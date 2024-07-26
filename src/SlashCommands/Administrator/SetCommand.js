import SlashCommands from '../../Structure/SlashCommands.js';
import SetCommand from '../../Utils/Styles/StyleSetCommand.js';
const Style = new SetCommand();

export default class extends SlashCommands {
  constructor(client) {
    super(client, {
      data: Style.StyleData()
    });
  }

  async execute(interaction) {
    const channel = interaction.options.getChannel('canal') || interaction.channel;
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'informações':
        channel.send(Style.StyleInformation()).then(() => {
          interaction.reply({ content: `Canal ${channel} configurado com sucesso!`, ephemeral: true })
        })
      break;
      case 'cores':
        channel.send(Style.StyleColors()).then(() => {
          interaction.reply({ content: `Canal ${channel} configurado com sucesso!`, ephemeral: true })
        })
      break;
      case 'starboard':
        const option = interaction.options.getString('disponibilidade');
        const inter = interaction.options.getInteger('quantidade') ?? 5;

        this.firebase.ref(`Configurations/Starboard/${interaction.guild.id}`).update({ start: option, size: inter, channelId: channel.id })
        interaction.reply({ content: `Canal ${channel} configurado com sucesso!`, ephemeral: true })
      break;
      case 'atendimento':
        channel.send(Style.StyleAtendimento()).then(() => {
          interaction.reply({ content: `Canal ${channel} configurado com sucesso!`, ephemeral: true })
        })
      break;
    }
  }
}
