const {DisconnectReason, useSingleFileAuthState} = require('@adiwajshing/baileys');
const makeWASocket = require('@adiwajshing/baileys').default;
const axios = require("axios");
const fs = require('fs');
const { MessageType, MessageOptions, Mimetype } = require('@adiwajshing/baileys');
const {savefrom} = require("@bochilteam/scraper");
const path = require("path");
const {resolveNs} = require("dns");


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
if(msg.key.fromMe || msg.key.remoteJid=="status@broadcast") return;
if(msg.message.conversation)  {
  pesan = msg.message.conversation;
  pesan = pesan.split(" ");
  console.log(pesan[1]);
  let pesan1;
  pesan1 = pesan[1];
  if(pesan[0]== "Cek" && !pesan1){
    sock.sendMessage(msg.key.remoteJid,{text: "Format Cek barang salah!!!\nContoh : Cek Indomie\n\nNote: Gunakan Huruf Kapital di setiap Kata"});
    return;
  }else if(pesan[0] == "Cek" && pesan1){
    const axi = await axios.get("https://script.google.com/macros/s/AKfycbwv86Eb35FQv1V7VXiYvrTB83pcqy-5nKxERYJr02RqvPtEGVjj2m_q2VoSpq_XNarH/exec?whatsapp="+pesan1);
    console.log(axi.data);
    const {success, data} = axi.data;
    let str;
    if(success){
      str = `Hallo kak ${msg.pushName}\n\n${data.NamaBarang}\nStok  : ${data.Status}\nHarga : ${data.Harga}\n\nTerimakasih sudah menghubungi Kami `;
      sock.sendMessage(msg.key.remoteJid,{text: str});
    }else if(!success){
      sock.sendMessage(msg.key.remoteJid,{text: `${pesan1} Tidak tersedia di Toko kami`});
    }


  }else if(pesan[0]=="List" && pesan1=="sgt3" && msg.key.remoteJid.split("-")[1]=='1607928526@g.us'){
    const axii = await axios.get("https://script.google.com/macros/s/AKfycbwv86Eb35FQv1V7VXiYvrTB83pcqy-5nKxERYJr02RqvPtEGVjj2m_q2VoSpq_XNarH/exec?whatsapp=SGT3");
 //   console.log(axii.data);
    const {success, data} = axii.data;
    if(success){
      const angka = data.Status;
      const splt = angka.split(",");
      console.log(splt);
      sock.sendMessage(msg.key.remoteJid,{text: splt[0]+splt[1]+splt[2]+splt[3]+splt[4]});
   }else if(!success){
     sock.sendMessage(msg.key.remoteJid,{text: `Sorry, Data tidak ditemukan`});
   }


  }else if(pesan[0]=="Convert" && pesan1){
   const sendGetRequest = async () => {
	return new Promise((resolve, reject) => {
		axios.get(`https://sub.bonds.id/sub2?target=clash&url=${pesan1}&insert=false&config=base/database/config/standard/standard_redir.ini&emoji=false&list=false&udp=true&tfo=false&expand=false&scv=true&fdn=false&sort=false&new_name=true`)
			.then((response) => {
				resolve(response);
			}).catch((err) => {
				reject(err);
		});
	});
}

sendGetRequest()
	.then((respdata) => {
	let response = respdata.data.toString();
	let ccdw = response.match(/proxies\:([\S\s]*)proxy\-groups/i)[1];
//    console.log(ccdw);
    sock.sendMessage(msg.key.remoteJid,{text: ccdw});
	});

//DOWNLOAD-TIKTOK~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }else if(pesan[0]=="Tiktok" && pesan1){

    const sendGetRequest = async () => {
  data = await savefrom(pesan1)
  data1 = data[0].url[0].url;
	return new Promise((resolve, reject) => {
    const localFilePath = path.resolve(__dirname, 'media', "tes.mp4");
		const ress = axios({
      method: 'GET',
      url: data1,
      responseType: 'stream',
    })
			.then((response) => {
      const w = response.data.pipe(fs.createWriteStream(localFilePath));
    w.on('finish', () => {
      console.log('Successfully downloaded file!');
      sock.sendMessage(
      msg.key.remoteJid,
        {
          video: fs.readFileSync("./media/tes.mp4"),
          caption: "Tes",
          gifPlayback: false
        })

    });



			}).catch((err) => {
				reject(err);
		});
	});//END PROMISE
}

sendGetRequest()



  }//elseif pesan baru


}else if(msg.message.extendedTextMessage){
  const extended = msg.message.extendedTextMessage.text;
  extended = extended.split(" ");

  if(extended[0]=="Tiktok" && extended[1]){

    const sendGetRequest = async () => {
  data = await savefrom(extended[1])
  data1 = data[0].url[0].url;
	return new Promise((resolve, reject) => {
    const localFilePath = path.resolve(__dirname, 'media', "tes.mp4");
		const ress = axios({
      method: 'GET',
      url: data1,
      responseType: 'stream',
    })
			.then((response) => {
      const w = response.data.pipe(fs.createWriteStream(localFilePath));
    w.on('finish', () => {
      console.log('Successfully downloaded file!');
      sock.sendMessage(
      msg.key.remoteJid,
        {
          video: fs.readFileSync("./media/tes.mp4"),
          caption: "Tes",
          gifPlayback: false
        })

    });



			}).catch((err) => {
				reject(err);
		});
	});//END PROMISE
}
sendGetRequest()

  }//TIKTOK TUTUP PESAN EXTENDED
}//TUTUP PESAN BASIS EXTENDED











 //UTUP IF FROM ME



});//TUTUP PESANN
}


startSock();
