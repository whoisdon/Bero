import EventMap from '../../Structure/EventMap.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

export default class extends EventMap {
    constructor(client) {
        super(client, {
            name: 'messageReactionAdd'
        });
    }

    run = async (reaction, user) => {
        if (reaction.emoji.name !== '⭐') return;

        const config = (await this.firebase.ref(`Configurations/Starboard/${reaction.message.guildId}`).once("value")).val()
        if (!config.start || config.start === 'off') return;

        const starBoardRef = this.firebase.ref(`Message/StarBoard/${reaction.message.id}`);
        const existingData = (await starBoardRef.once("value")).val();

        if (!existingData && reaction.count === config.size) {
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `${reaction.message.author.username} (${reaction.message.author.id})`,
                    iconURL: reaction.message.author.displayAvatarURL({ dynamic: true })
                })
                .setColor('#EADDCA')
                .setTimestamp();

            if (reaction.message.attachments.size > 0) {
                const image = reaction.message.attachments.first();
                embed.addFields({ name: '📁 Arquivo', value: `[${image.name}](${image.url})` });
                embed.setImage(image.url);
            }

            if (reaction.message.stickers.size > 0) {
                const stickers = reaction.message.stickers.first();
                if (stickers?.url) {
                    embed.setImage(stickers.url);
                }
            }

            if (reaction.message.content) {
                embed.setDescription(reaction.message.content);
            }

            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Ir para mensagem')
                        .setStyle(ButtonStyle.Link)
                        .setURL(reaction.message.url)
                );

            const channel = this.client.channels.cache.get(config.channelId);

            channel.send({
                content: `🌟 ${config.size} - ${reaction.message.url}`,
                embeds: [embed],
                components: [button]
            }).then((message) => {
                starBoardRef.update({ messageId: message.id, channelId: channel.id });
            });
        } else if (existingData) {
            const channel = this.client.channels.cache.get(existingData.channelId);
            const message = await channel.messages.fetch(existingData.messageId);

            message.edit({
                content: `${message.content.replace(/🌟 (\d+) -/, (_, messagenumber) => `🌟 ${reaction.count} -`)}`
            });
        }
    }
}
