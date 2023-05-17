const express = require("express");
const app = express();


const path = require('path');
const fs = require('fs');

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
let image_num;
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    credentials: true,
  },
});

const PORT = 5000;
const correct_anser = "正解！";
const uncorrect_anser = "不正解・・・";


const arr = ["ぺりー", "おだのぶなが","すぎたげんぱく","べーとーべん"];

//test
app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

//クライアントと通信
io.on("connection", (socket) => {
  console.log("クライアントと接続しました！");

  //クライアントから回答を受信
  socket.on("send_message", (data) => {
    console.log("recive =",data.q_number);
    
    //クライアントへマルバツを返信
    if(data.message==arr[data.q_number]){
        io.emit("received_message",{message:'正解！　解答「'+data.message+'」'});
        console.log("OK");
    }else{
        io.emit("received_message", {message:'不正解・・・　解答「'+data.message+'」'});
        console.log(data.message);
        console.log(arr[data.q_number]);
    }
  });

  //クライアントから出題を受信
  socket.on('send_question', reason => {

    image_num = Math.floor(Math.random() * 4)
    console.log("send =",image_num);
    let imageFilePath = path.join(__dirname, `public/img/image_${image_num}.png`);

    fs.readFile(imageFilePath, 'base64', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        const imgSrc = 'data:image/jpg;base64,' + data;
        socket.emit('sendImage', { image_num : image_num , imgSrc: imgSrc });
    });
});
});

server.listen(PORT, () => console.log(`server is running on ${PORT}`));