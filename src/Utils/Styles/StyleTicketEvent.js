import Emoji from "../../Config/Emojis.json" assert { type: "json" };
import Config from "../../Config/Config.json" assert { type: "json" };
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import * as discordTranscripts from 'discord-html-transcripts';
import axios from 'axios';
import SetCommand from './StyleSetCommand.js';

const Style = new SetCommand();

export default class TicketEvent {
  constructor({ client, firebase, interaction }) {
    this.emoji = Emoji;
    this.client = client;
    this.firebase = firebase;
    this.interaction = interaction;
    this.transcriptURL = Config.transcriptURL;
    this.ticketCloseButtons = this.createTicketCloseButtons();
  }

  createDefaultMessage() {
    return new EmbedBuilder()
      .setDescription(`\`📨\` Agradecemos por entrar em contato conosco. Seu ticket foi aberto com êxito!
  Por favor, digite sua mensagem e aguarde enquanto nossa equipe fornece o suporte necessário. Estamos prontos para ajudar e responderemos o mais rápido possível.`)
      .setColor('#000000')
      .setFooter({ text: this.interaction.guild.name, iconURL: this.interaction.guild.iconURL() })
      .setTimestamp();
  }
  
  createDefaultButton() {
    return new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('ticket-confirm')
          .setStyle(ButtonStyle.Danger)
          .setLabel('Fechar Ticket')
          .setEmoji('🔒')
      )
  }

  createTicketCloseButtons() {
    return new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('Transcript').setCustomId('ticket-transcript').setStyle(ButtonStyle.Primary).setEmoji('📄'),
      new ButtonBuilder().setLabel('Reabrir Ticket').setCustomId('ticket-reopen').setStyle(ButtonStyle.Success).setEmoji('🔓'),
      new ButtonBuilder().setLabel('Deletar o Ticket').setCustomId('ticket-delete').setStyle(ButtonStyle.Primary).setEmoji('🗑️')
    );
  }

  async createTicket() {
    const name = (await this.firebase.ref(`Configurations/Ticket/Global/${this.interaction.guildId}`).once('value')).val();

    const create = await this.interaction.guild.channels.create({
      name: `ticket-${String(name?.size || 0).padStart(4, '0')}`,
      type: ChannelType.GuildText,
      parent: this.interaction.channel.parentId,
      permissionOverwrites: [
        { id: this.interaction.guild.id, deny: ['ViewChannel'] },
        { id: this.interaction.user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'AttachFiles', 'AddReactions'] }
      ],
    });

    create.send({ content: `${this.interaction.user}`, embeds: [this.createDefaultMessage()], components: [this.createDefaultButton()] }).then((m) => {
      this.firebase.ref(`Tickets/${this.interaction.guildId}/${create.id}`).update({
        userId: this.interaction.user.id,
        ticket: this.interaction.values[0]
      });
      this.firebase.ref(`Configurations/Ticket/Global/${this.interaction.guildId}`).update({
        size: (name?.size || 0) + 1
      });
    });

    const button = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Ir para o canal').setURL(`https://discord.com/channels/${this.interaction.guildId}/${create.id}`)
      );

    this.interaction.reply({ components: [button], ephemeral: true });
    this.interaction.message.edit({ components: Style.StyleAtendimento().components });
  }

  async createTranscript(db) {
    try {
      const author = this.client.users.cache.get(db.userId);
      const str = (await discordTranscripts.createTranscript(this.interaction.channel)).attachment.toString('utf-8');
      const html = new AttachmentBuilder(Buffer.from(str, 'utf-8'), { name: 'transcript.html' });
      const { data } = await axios.post(this.transcriptURL, { data: str });

      const embed = new EmbedBuilder()
        .setAuthor({
          name: author.username,
          iconURL: author.displayAvatarURL({ dynamic: true }),
          url: data.route
        })
        .setColor('#000000')
        .addFields(
          { name: 'Dono do Ticket', value: `${author}`, inline: true },
          { name: 'Nome do Ticket', value: `${this.interaction.channel?.name}`, inline: true },
          { name: 'Nome do Painel', value: `${db.ticket}`, inline: true },
          { name: 'Acessar transcript', value: `[aqui](${data.route})`, inline: true },
          { name: 'Código', value: `\`${data.code}\``, inline: true },
        );

      const button = new ActionRowBuilder()
      .addComponents(
          new ButtonBuilder().setLabel('Direct Link').setStyle(ButtonStyle.Link).setURL(data.route)
      );

      const transcript = (await this.firebase.ref(`Configurations/Transcript/${this.interaction.guildId}`).once('value')).val()

      this.client.channels.cache.get(transcript.channelId).send({ embeds: [embed], components: [button], files: [html] });
      this.interaction.reply({ content: 'Transcript gerado com sucesso!', ephemeral: true });
    } catch (err) {
      const button = new ButtonBuilder()
      .setCustomId('ticket-transcript')
      .setLabel('Tentar novamente')
      .setStyle(ButtonStyle.Primary)
      
      this.interaction.reply({ content: 'Ocorreu um erro inesperado ao tentar gerar o transcript', components: [new ActionRowBuilder(button)], ephemeral: true })
    }
  }

  closeTicket(db) {
    this.interaction.channel.permissionOverwrites.edit(db.userId, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
      AttachFiles: true,
      AddReactions: true,
    });

    this.interaction.update({}) // TODO: Refactor update button
    this.interaction.channel.send(this.StyleTicketClose());
  }

  StyleTicketClose() {
    const close = new EmbedBuilder()
    .setDescription(`Ticket fechado por ${this.interaction.user}`)
    .setColor('#ffff00');

    const panel = new EmbedBuilder()
    .setDescription('```A equipe de suporte está armazenando seus tickets```')
    .setColor('#000000');

    return { embeds: [close, panel], components: [this.ticketCloseButtons] };
  }

  reopenTicket(db) {
    this.interaction.channel.permissionOverwrites.edit(db.userId, {
      ViewChannel: false,
      SendMessages: false,
      ReadMessageHistory: false,
      AttachFiles: false,
      AddReactions: false,
    });

    const reopen = new EmbedBuilder()
    .setDescription(`Ticket reaberto por ${this.interaction.user}`)
    .setColor('#ffff00');

    this.interaction.message.delete().catch(() => { }) // TODO: Refactor update button
    this.interaction.channel.send({ embeds: [reopen] });
  }

  deleteTicket() {
    this.firebase.ref(`Tickets/${this.interaction.guildId}/${this.interaction.channelId}`).remove();

    this.interaction.channel.delete().catch(() => { })
  }

  confirmTicket() {
    const confirm = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId('fechar-ticket')
      .setLabel('Confirmar Fechamento')
      .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
      .setCustomId('cancelar-ticket')
      .setLabel('Cancelar')
      .setStyle(ButtonStyle.Danger)
    )

    this.interaction.update({})
    this.interaction.channel.send({ content: 'Você tem certeza que deseja fechar este ticket?', components: [confirm] })
  }

  cancelTicket() {
    this.interaction.message.delete().catch(() => {})
  }
}
