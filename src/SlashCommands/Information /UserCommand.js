import SlashCommands from '../../Structure/SlashCommands.js';
import Config from "../../Config/Config.json" assert { type: "json" };
import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } from 'discord.js';

export default class extends SlashCommands {
  constructor(client) {
    super(client, {
      data: new SlashCommandBuilder()
      .setName('user')
      .setDescription('⎾Informação⏌ Mostra as informações de um usuário no Discord.')
      .addSubcommand(subcommand => subcommand
        .setName('avatar')
        .setDescription('⎾Informação⏌ Veja o avatar de um usuário.')
        .addUserOption(option => option
          .setName('user')
          .setDescription('⎾Informação⏌ Usuário que deseja buscar.')  
          .setRequired(true)
        )
      )
    });
  }

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const avatar = interaction.user.displayAvatarURL({ dynamic: true, size: 2048 });

    const embed = new EmbedBuilder()
    .setTitle(`🖼️ ${interaction.user.username}`)
    .setImage(avatar);

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
      .setLabel('Abrir avatar no navegador')
      .setStyle('Link')
      .setURL(avatar)
    )
    

    if (Config.default_developers.includes(user.id)) {
      embed.setFooter({ text: 'Um de meus lindos criadores.' })
    }
    
    else if (user === interaction.user) {
      embed.setFooter({ text: 'Apesar de tudo, ainda é você.' })
    }

    else if (user === this.client.user) {
      embed.setFooter({ text: 'Sim, eu sei que sou muito lindo!' })
    }

    interaction.reply({ embeds: [embed], components: [button] })
  }
}
