import EventMap from '../../Structure/EventMap.js';
import Config from "../../Config/Config.json" assert { type: "json" };
import { EmbedBuilder } from 'discord.js';

export default class extends EventMap {
  constructor(client) {
    super(client, {
      name: 'interactionCreate'
    });
  }

  run = async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId !== 'colors') return;

    const ids = Config.colors.map(color => Object.values(color)[0]);
    const memberRoles = interaction.member.roles.cache;
    const hasRole = ids.some(id => memberRoles.has(id));
    const roleToRemove = memberRoles.find(role => ids.includes(role.id));

    if (hasRole) {
        await interaction.member.roles.remove(roleToRemove.id).catch(() => { });
    }

    const roleToAdd = Config.colors.find(color => Object.keys(color)[0] === interaction.values[0]);
    const add = Object.values(roleToAdd)[0];

    const embed = new EmbedBuilder()
    .setTitle('Funções de usuário atualizadas')
    .setColor('#228b22')
    .addFields(
        { name: `${this.emoji.check} Cor adicionada:`, value: `<@&${add}>` },
        { name: `${this.emoji.uncheck} Cor removida:`, value: `${roleToRemove ?? '/'}` }
    )

    await interaction.member.roles.add(add).catch(() => { });
    interaction.reply({ embeds: [embed], ephemeral: true })
  }
}
