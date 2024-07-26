import EventMap from '../../Structure/EventMap.js';
import Config from "../../Config/Config.json" assert { type: "json" };
import { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const { 
  'Membro Ativo': MembroAtivo, 
  'Membro Incomum': MembroIncomum, 
  'Raro': Raro,
  'Épico': Epico, 
  'Lendário (a)': Lendario, 
  'Mítico': Mitico,
  'Bero Booster': Booster
} = Config.roles;

export default class extends EventMap {
  constructor(client) {
    super(client, {
      name: 'interactionCreate'
    });
  }
  
  cargos = new EmbedBuilder()
.setTitle('⭐ Cargos por Nível')
.setDescription(`Level 5: ${MembroAtivo} \nLevel 10: ${MembroIncomum} \nLevel 15: ${Raro} \nLevel 20: ${Epico} \nLevel 30: ${Lendario} \nLevel 50: ${Mitico}\n
**Progressão e Recompensas**
Suba de nível ao interagir no servidor! Envie mensagens, participe de eventos e contribua para as discussões. À medida que avança, desbloqueia novos cargos em destaque. No Nível ${Lendario}, conquiste o direito de personalizar seu apelido.`)
.setColor('#000000')

  booster = new EmbedBuilder()
.setTitle(`${this.emoji.boost} Bero Boosters - Mansão Dev`)
.setDescription(`E aí, Boosters! Prontos para elevar a vibe na Mansão Dev? Como Booster, você vai curtir uns privilégios especiais aqui no servidor. Dá uma olhada:

• Cargo Exclusivo: ${Booster} \n• Escolher Sua Própria Cor no Servidor \n• Enviar Mídias no Chat-Geral \n• Link no Chat-Geral \n• Mensagem de Voz \n• 2XP+ na Loritta \n• Emojis e Stickers Externos \n• Imune a Requisitos de Sorteio \n• Chat VIP e Call Booster`)
.setColor('#000000')

  parcerias = new EmbedBuilder()
.setTitle(`🤝 Requisitos de parceria`)
.setDescription(`- O servidor requer uma base mínima de 100 membros. \n- Deve apresentar regras claras e uma moderação eficaz. \n- Todo o conteúdo deve ser apropriado para todas as idades (+18 proibido) \n- Venda de Nitro, contas ou conteúdos não autorizado pelas plataformas não aceitamos. \n- Cumpra as Diretrizes estabelecidas pelo Discord.

**Meu servidor cumpre os requisitos, e agora?**
Acesse nosso <#${Config.channels.atendimento}> para entrar em contato conosco! Vamos verificar a elegibilidade do servidor e responderemos o mais rápido possível.`)
.setColor('#000000')

  redes = new EmbedBuilder()
.setTitle(`📲 Redes Sociais`)
.setDescription(`Bero, conhecido como @meunomeebero, é um criador de conteúdo apaixonado por programação. Ele compartilha seu conhecimento e paixão através de várias plataformas de mídia social.

Além disso, Bero é o CEO do servidor Mansão Dev, um espaço dedicado para se conectar com outros entusiastas da programação e aprender mais sobre o mundo da codificação.

Se você está interessado em programação ou quer aprender mais, vale a pena conferir o conteúdo de Bero. Ele tem uma maneira única e envolvente de compartilhar seu conhecimento que é tanto informativa quanto divertida. Não deixe de conferir! 😊`)
.setColor('#000000')

  linktree = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
    .setLabel('Github')
    .setStyle(ButtonStyle.Link)
    .setURL('https://github.com/robertokbr?tab=repositories'),
    new ButtonBuilder()
    .setLabel('Youtube')
    .setStyle(ButtonStyle.Link)
    .setURL('https://www.youtube.com/@meunomeebero'),
    new ButtonBuilder()
    .setLabel('Tiktok')
    .setStyle(ButtonStyle.Link)
    .setURL('https://www.tiktok.com/@meunomeebero'),
    new ButtonBuilder()
    .setLabel('Instagram')
    .setStyle(ButtonStyle.Link)
    .setURL('https://www.instagram.com/instadobero')
  )

  run = async (interaction) => {
    if (!interaction.isButton()) return;
    
    const replies = {
      'cargos': { embeds: [this.cargos], ephemeral: true },
      'boosters': { embeds: [this.booster], ephemeral: true },
      'parcerias': { embeds: [this.parcerias], ephemeral: true },
      'redes sociais': { embeds: [this.redes], components: [this.linktree], ephemeral: true }
    };
    
    if (replies[interaction.customId]) {
      interaction.reply(replies[interaction.customId]);
    }
  }
}
