const {DisconnectReason, useSingleFileAuthState} = require('@adiwajshing/baileys');
const makeWASocket = require('@adiwajshing/baileys').default;


const startSock = () => {
  const {state, saveState} = useSingleFileAuthState('./auth.json');
   const sock = makeWASocket({
     printQRInTerminal: true,
     auth: state
  });

  sock.ev.on('connection.update', function (update, connection2){
    let _a, _b;
    let connection = update.connection, lastDisconnect = update.lastDisconnect;
    if(connection=='close'){
        if(((_b = (_a = lastDisconnect.error) === null
            || _a === void 0 ? void 0 : _a.output) === null
            || _b === void 0 ? void 0 : _b.statusCode) !== DisconnectReason.loggedout) {
        startSock();
        }

    }else{
    console.log('connection closed');
   }
    console.log('BOT TERHUBUNG');

  });

sock.ev.on('creds.update', saveState);

sock.ev.on('messages.upsert', async m => {
  console.log(JSON.stringify(m, undefined, 2))
  const msg = m.messages[0];
if(m.type=="notify"){
  console.log("Pesan dari : "+msg.key.remoteJid);
  console.log("Isi pesan  : "+msg.message.conversation);
  if(msg.message.conversation=="Trojan"){
    sock.sendMessage(msg.key.remoteJid,{ text: "AKUN KOSONG BOZKUU"});  
  }else if(msg.message.conversation=="Hallo Bot"){
    sock.sendMessage(msg.key.remoteJid,{text: "pesan BOT diterima"});
  }else{
    sock.sendMessage(msg.key.remoteJid,{ text: "Saya tidak tahu maksud Anda"});
  }











} //UTUP IF FROM ME



});//TUTUP PESANN
}


startSock();
