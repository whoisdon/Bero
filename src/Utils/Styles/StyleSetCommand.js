import Emoji from "../../Config/Emojis.json" assert { type: "json" };
import Config from "../../Config/Config.json" assert { type: "json" };
import { PermissionFlagsBits, SlashCommandBuilder, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';

export default class SetCommand {
    constructor() {
        this.emoji = Emoji;
    }

    StyleData() {
        return new SlashCommandBuilder()
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setName('set')
        .setDescription('⎾Administração⏌ Configure o servidor.')
        .addSubcommand(subcommand => subcommand
            .setName('informações')
            .setDescription('⎾Administração⏌ Configure o canal padrão para embed de informação.')
            .addChannelOption(options => options
              .setName('canal')
              .setDescription('⎾Canal⏌ Canal para embed de informação.')
              .addChannelTypes(ChannelType.GuildText)
            )
        )
        .addSubcommand(subcommand => subcommand
          .setName('cores')
          .setDescription('⎾Administração⏌ Configure o canal padrão para embed de cores.')
          .addChannelOption(options => options
            .setName('canal')
            .setDescription('⎾Canal⏌ Canal para embed de informação.')
            .addChannelTypes(ChannelType.GuildText)
          )
        )
        .addSubcommand(subcommand => subcommand
          .setName('starboard')
          .setDescription('⎾Administração⏌ Configure o starboard no servidor.')
          .addStringOption(option => option
              .setName('disponibilidade')
              .setDescription('⎾Choices⏌ Ativar ou desativar o starboard.')
              .addChoices(
                { name: 'Ativar', value: 'on' },
                { name: 'Desativar', value: 'off' }
              )
          )
          .addChannelOption(options => options
            .setName('canal')
            .setDescription('⎾Canal⏌ Canal para direcionar o conteúdo.')
            .addChannelTypes(ChannelType.GuildText)
          )
          .addIntegerOption(option => option
            .setName('quantidade')
            .setDescription('⎾Quantidade⏌ Quantidade de reações para contabilizar.')
            .setMinValue(1)
          )
        )
        .addSubcommand(subcommand => subcommand
          .setName('atendimento')
          .setDescription('⎾Administração⏌ Configure o canal padrão para atendimento.')
          .addChannelOption(options => options
            .setName('canal')
            .setDescription('⎾Canal⏌ Canal para embed de informação.')
            .addChannelTypes(ChannelType.GuildText)
          )
          .addChannelOption(options => options
            .setName('transcript')
            .setDescription('⎾Canal⏌ Qual canal para o envio dos transcripts.')
            .addChannelTypes(ChannelType.GuildText)
          )
        )
    }

    StyleInformation() {
        const information = new EmbedBuilder()
        .setTitle(`${this.emoji.berubeurbeurb} Informações`)
        .setDescription('Bem-vindo ao nosso espaço de informações e dúvidas frequentes! Aqui você encontrará respostas para suas perguntas comuns e informações importantes sobre o servidor. Estamos aqui para mantê-lo informado e ajudar a esclarecer suas dúvidas.')
        .setImage(Config.imagens.info)
        .setColor('#000000')
    
        const buttons_information = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setCustomId('cargos')
          .setLabel('Cargos')
          .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
          .setCustomId('boosters')
          .setLabel('Boosters')
          .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
          .setCustomId('parcerias')
          .setLabel('Parcerias')
          .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
          .setCustomId('redes sociais')
          .setLabel('Redes Sociais')
          .setStyle(ButtonStyle.Secondary)
        )

        return { embeds: [information], components: [buttons_information] }
    }

    StyleColors() {
        const colors = new EmbedBuilder()
        .setTitle('Cores')
        .setDescription('Dê um toque especial no seu nick no servidor, selecionando a **cor** que mais combina com você no menu abaixo :)')
        .setThumbnail(Config.imagens.colors.thumbnail)
        .setImage(Config.imagens.colors.image)
        .setColor('#000000')

        const colors_select = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('colors')
            .setPlaceholder('Selecione uma cor aqui!')
            .addOptions(
                ...Config.colors.map(color => {
                const value = Object.keys(color)[0];

                return new StringSelectMenuOptionBuilder()
                    .setLabel(value)
                    .setEmoji(color.emoji)
                    .setValue(value)
                })
            )
        )

        return { embeds: [colors], components: [colors_select] }
    }

    StyleAtendimento() {
        const embed_atendimento = new EmbedBuilder()
        .setTitle(`${this.emoji.berubeurbeurb} Atendimento Mansão Dev!`)
        .setDescription(`Bem-vindo ao atendimento do servidor. Aqui, você pode relatar bugs de bots, denunciar outros membros, solicitar parcerias ou se comunicar diretamente com nossa equipe.
**Importante**
\`-\` Evite abrir tickets de teste, eles podem prejudicar o atendimento. \n\`-\` Seu ticket é anônimo e só uma equipe autorizada terá acesso às
Informações
\`-\` Se uma opção for clicada, o ticket será criado no mesmo instante!`)
        .setColor('#000000')

        const components_atendimento = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('atendimento')
            .setPlaceholder('Selecione uma das opções abaixo!')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                .setLabel('Denúncia')
                .setDescription('Para denúncia de usuários ou bug de bots.')
                .setEmoji(this.emoji.gavel)
                .setValue('Denúncia'),
                new StringSelectMenuOptionBuilder()
                .setLabel('Parceria')
                .setDescription('Junte-se a nós e faça parceria aqui!')
                .setEmoji(this.emoji.users1)
                .setValue('Parceria'),
                new StringSelectMenuOptionBuilder()
                .setLabel('Atendimento Simples')
                .setDescription('Deseja contato com a nossa equipe? Estamos à disposição!')
                .setEmoji(this.emoji.users1)
                .setValue('Atendimento Simples')
            )
        )

        return { embeds: [embed_atendimento], components: [components_atendimento] }
    }
}
