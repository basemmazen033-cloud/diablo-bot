const TOKEN = '9083744124:AAHSZlViZSznm6kubB61hjt3cVkuQDuUWLw';
const fs = require('fs');
const path = require('path');
if(!fs.existsSync('commands')) fs.mkdirSync('commands');
let cfg = {name:'SHALLTEAR', mode:'عام', owner:null};
if(fs.existsSync('config.json')){ try{ cfg = JSON.parse(fs.readFileSync('config.json','utf8')); }catch(e){} }
cfg.name='SHALLTEAR';
function saveCfg(){ fs.writeFileSync('config.json', JSON.stringify(cfg, null, 2)); }
saveCfg();
const express = require('express');
const app = express();
app.get('/', (req,res)=>res.send('SHALLTEAR BOT IS RUNNING'));
app.listen(process.env.PORT || 3000, ()=>console.log('Web on'));
let offset = 0;
console.log('SHALLTEAR BOT IS RUNNING...');
async function send(chatId, text){
await fetch('https://api.telegram.org/bot'+TOKEN+'/sendMessage', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({chat_id: chatId, text: text})});
}
async function poll(){
while(true){
try{
const r = await fetch('https://api.telegram.org/bot'+TOKEN+'/getUpdates?timeout=30&offset='+offset);
const d = await r.json();
for(const u of d.result || []){
offset = u.update_id + 1;
const msg = u.message;
if(!msg || !msg.text) continue;
const chatId = msg.chat.id;
const userId = msg.from.id;
const text = msg.text.trim();
if(!cfg.owner){ cfg.owner = userId; saveCfg(); }
const isOwner = userId === cfg.owner;
if(cfg.mode === 'خاص' && !isOwner){ await send(chatId, 'Go away servant, Queen is in private mode'); continue; }
console.log('Got: ' + text);
if(text.includes('\u0634\u0627\u0644\u062a\u0631')){
if(isOwner){ await send(chatId, '\u062e\u0627\u062f\u0645\u062a\u0643 \u064a\u0627 \u0645\u0648\u0644\u0627\u064a 👑🩸'); }
else{ await send(chatId, '\u0639\u0627\u064a\u0632 \u0627\u064a\u0647 \u064a\u0627\u062e\u0627\u062f\u0645'); }
continue;
}
if(text === '/start'){ await send(chatId, 'Welcome my servant... I am SHALLTEAR, Queen of Vampires. What do you want? Send !الاوامر to see my orders'); continue; }
if(text === '!بحبك'){ await send(chatId, 'احا، بتقولي بحبك للملكة؟ ماشي يا خادمي، الملكة بتحبك سيكة 🩸👑'); continue; }
if(text === '!هزار'){ await send(chatId, 'اسمع يا خادمي، مرة مصاص دماء دخل على دكتور، قاله عندي انيميا، قاله خد دم حد تاني 😈🩸'); continue; }
if(text === '!ping'){ await send(chatId, 'I am here my servant, why are you calling your Queen? pong - working'); continue; }
if(text === '!الاوامر'){
const files = fs.readdirSync('commands').filter(f=>f.endsWith('.js')).map(f=>f.replace('.js',''));
await send(chatId, 'Queen Orders:\n!ping\n!الاوامر\n!مود خاص / !مود عام\n!تغيير_الاسم\n!اضافة <name>\n!عرض <name>\n!حذف <name>\n' + (files.length ? files.map(f=>'!'+f).join('\n') : 'No orders yet my servant'));
continue;
}
if(text === '!مود خاص'){ if(!isOwner){ await send(chatId,'You are not my Master'); continue; } cfg.mode='خاص'; saveCfg(); await send(chatId,'Done my Master, Queen is now private'); continue; }
if(text === '!مود عام'){ if(!isOwner){ await send(chatId,'You are not my Master'); continue; } cfg.mode='عام'; saveCfg(); await send(chatId,'Done my Master, Queen is now public'); continue; }
if(text.startsWith('!تغيير_الاسم')){
if(!isOwner){ await send(chatId,'You are not my Master'); continue; }
const n = text.replace('!تغيير_الاسم','').trim();
if(!n){ await send(chatId,'Write: !تغيير_الاسم <new name>'); continue; }
cfg.name=n; saveCfg(); await send(chatId,'Done my Master, Queen name is now: '+n);
continue;
}
if(text.startsWith('!اضافة')){
if(!isOwner){ await send(chatId,'You are not my Master'); continue; }
const lines = msg.text.split('\n');
const first = lines[0].replace('!اضافة','').trim();
const codeText = lines.slice(1).join('\n').trim();
if(!first || !codeText){ await send(chatId,'How to: !اضافة <name>\n<reply>'); continue; }
fs.writeFileSync(path.join('commands', first+'.js'), codeText);
await send(chatId,'Done my Master, Queen added: !'+first);
continue;
}
if(text.startsWith('!عرض')){
const n = text.replace('!عرض','').trim();
if(!fs.existsSync(path.join('commands', n+'.js'))){ await send(chatId,'No order with this name'); continue; }
await send(chatId, fs.readFileSync(path.join('commands', n+'.js'),'utf8'));
continue;
}
if(text.startsWith('!حذف')){
if(!isOwner){ await send(chatId,'You are not my Master'); continue; }
const n = text.replace('!حذف','').trim();
const fp = path.join('commands', n+'.js');
if(!fs.existsSync(fp)){ await send(chatId,'No order with this name'); continue; }
fs.unlinkSync(fp);
await send(chatId,'Done my Master, Queen deleted: !'+n);
continue;
}
if(text.startsWith('!اعادة_تشغيل')){ await send(chatId,'Okay my Master, Queen will return...'); process.exit(0); }
if(text === '\u0634\u0627\u0644\u062a\u0631' || text === '\u0634\u0627\u0644\u062a\u064a\u0631'){
if(isOwner){ await send(chatId, '\u062e\u0627\u062f\u0645\u062a\u0643 \u064a\u0627 \u0645\u0648\u0644\u0627\u064a  👑🩸'); }
else{ await send(chatId, '\u0639\u0627\u064a\u0632 \u0627\u064a\u0647 \u064a\u0627\u062e\u0627\u062f\u0645'); }
continue;
}
if(text.startsWith('!')){
const n = text.slice(1).split(' ')[0];
const fp = path.join('commands', n+'.js');
if(fs.existsSync(fp)){
const c = fs.readFileSync(fp,'utf8');
try{
if(c.includes('send(') || c.includes('return')){
const fn = new Function('send','chatId','text', 'return (async()=>{ '+c+' })()');
await fn((t)=>send(chatId,t), chatId, text);
} else { await send(chatId, c); }
}catch(e){ await send(chatId,'Queen is angry, error: '+e.message); }
}
}
}
}catch(e){ console.log('poll error: '+e.message); await new Promise(x=>setTimeout(x,2000)); }
}
}
poll();
