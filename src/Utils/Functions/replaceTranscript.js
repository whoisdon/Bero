import { writeFileSync, readFileSync } from 'fs';

const filePath = 'node_modules/discord-html-transcripts/dist/generator/index.js';
const searchString = 'react_1.default.createElement("a", { href: "https://github.com/ItzDerock/discord-html-transcripts", style: { color: \'lightblue\' } }, "discord-html-transcripts"),';
const replacementString = 'react_1.default.createElement("a", { href: "https://discord.gg/v8FZeHtbsK", style: { color: \'lightblue\' } }, "Mansão Dev"),';

const content = readFileSync(filePath, 'utf-8');
if (!content.includes(replacementString)) {
    writeFileSync(filePath, content.replace(searchString, replacementString));
}
