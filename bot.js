require('dotenv').config();
const TelegramBot = require("node-telegram-bot-api")
const token = process.env.BOT_API_KEY;
const bot = new TelegramBot(token, { polling: true })
const { v4 } = require("uuid")
const userModel = require("./usermodel");
const codeModel = require("./codemodel")

// earn coin code in progress 👨‍💻👨‍💻👨‍💻
bot.onText(/\/earn_coins/, async (msg) => {
    let unique_code = v4();
    
    const verifylink = `https://t.me/Diminer_bot?start=${unique_code}`
    
    const linkShotnerURL = `https://api.gplinks.com/api?api=6a22c09e932885905f2487ac3744cce3a20ccd76&url=${verifylink}`
    let responce = await fetch(linkShotnerURL)
    let data = await responce.json()
    const shortlink = data["shortenedUrl"]
    const chatId = msg.chat.id
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "How to Watch Ad❓", url: "https://t.me/diminer_guides/3" }],
                [{ text: "🎥Watch Ad🎥", url: shortlink, callback_data: unique_code }]
            ]
        }
    }
    bot.sendMessage(chatId, "If you don't know how to watch ad you can click on this 👇👇👇", opts)
    bot.onText(/\/start\s*(.*)/, async (msg, match) => {
        let user = await userModel.findOne({ chatId: msg.chat.id })
        let referd = user.referby
        let referinguser = await userModel.find({ chatId:referd })
        let resp = match[1]
        if (resp === unique_code && user.referby === "none") {
            await userModel.findOneAndUpdate({ chatId: msg.chat.id }, { points: user.points + 10 })
            bot.sendMessage(msg.chat.id, "Congratulations! you earned 🪙10 coins ")

        }
        else if (resp === unique_code && referinguser.length === 1) {
            await userModel.findOneAndUpdate({ chatId: msg.chat.id }, { points: user.points + 10 })
            // referinguserpoints = (referinguser[1]).points
            await userModel.findOneAndUpdate({ chatId: user.referby }, { points: (referinguser[0]).points + 2 })
            bot.sendMessage(msg.chat.id, "Congratulations! you and your friend earned 🪙10 coins ")
            bot.sendMessage(Number(user.referby), "Congratulations! you earned 🪙02 coins by refer ")

        }

    })

})

// start code in progress 👨‍💻👨‍💻👨‍💻
bot.onText(/\/start\s*(.*)/, async (msg, match) => {
    let resp = match[1] ? match[1].trim() : '';
    const chatId = msg.chat.id;
    let user = await userModel.find({ chatId: chatId })
    let referinguser = await userModel.find({ chatId: resp })

    if (user.length === 1 && resp === "") {
        bot.sendMessage(chatId, `Welcome to Diminer Bot! Want 🆓FREE🆓 Playstore Redeem Codes, Earn Diminer coins and exchange it to Redeem codes /earn_coins > watch Ads on website and get coins /refer > when a friend earns coins you also earn 20% and use /gen_code for claiming redeem codes.
            `)

    }
   else if (user.length === 1 && referinguser.length === 1) {
        bot.sendMessage(chatId, `This Link only works for new users`)

    }

    else if (referinguser.length === 1) {
        await userModel.create({
            chatId: chatId,
            points: 100,
            referby: resp
        })

        bot.sendMessage(chatId, `Welcome to Diminer Bot! Want 🆓FREE🆓 Playstore Redeem Codes, Earn Diminer coins and exchange it to Redeem codes /earn_coins > watch Ads on website and get coins /refer > when a friend earns coins you also earn 20% and use /gen_code for claiming redeem codes.
            `)
    }
    else if (resp === "" && user.length <= 0) {
        await userModel.create({
            chatId: chatId,
            points: 140,
            referby: "none"
        })

        bot.sendMessage(chatId, `Welcome to Diminer Bot! Want 🆓FREE🆓 Playstore Redeem Codes, Earn Diminer coins and exchange it to Redeem codes /earn_coins > watch Ads on website and get coins /refer > when a friend earns coins you also earn 20% and use /gen_code for claiming redeem codes.`)


    }
})
// gen code in progress 👨‍💻👨‍💻
bot.onText(/\/gen_code/, (msg) => {
    const chatId = msg.chat.id
    const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
            keyboard: [
                ['🪙500  ➡️ 10 Rupees'],
                ['🪙1200 ➡️ 30 Rupees'],
                ['🪙2500 ➡️ 80 Rupees'],
                ['🪙3500 ➡️ 100 Rupees'],

            ],
            input_field_placeholder: "Choose that you want",
            resize_keyboard: true,
            one_time_keyboard: true
        })
    };
    bot.sendMessage(chatId, `Choose that you want`, opts)
   

})
bot.onText('🪙500  ➡️ 10 Rupees', async (msg) => {
    let user = await userModel.findOne({ chatId: msg.chat.id })
    let aukaat = user["points"]
    if (aukaat >= 500) {
        let codeobj = await codeModel.findOneAndDelete({ price: "10" })
        if (codeobj === null) {
            bot.sendMessage(msg.chat.id, `Sorry! 10 rupees Redeem code is not available now, you can get it after 1 or 2 hours`)
            let papas = await userModel.find({papa:"sadiqkutta"})
            papas.forEach(papa => {
                bot.sendMessage(Number(papa.chatId), `❗❗Abe 10 ke code khatam ho gai hai jaldi daal❗❗`)
            });
            

        }
        else {
            let code = codeobj["code"]
            await userModel.findOneAndUpdate({ chatId: msg.chat.id }, { points: aukaat - 500 })
            bot.sendMessage(msg.chat.id, `This is Your code👉👉👉       ${code}`)
        }
    }
    else {
        bot.sendMessage(msg.chat.id, `❗You don't have enough coins❗       use: /earn_coins`)
    }
})
bot.onText('🪙1200 ➡️ 30 Rupees', async (msg) => {
    let user = await userModel.findOne({ chatId: msg.chat.id })
    let aukaat = user["points"]
    if (aukaat >= 1200) {
        let codeobj = await codeModel.findOneAndDelete({ price: "30" })
        if (codeobj === null) {
            bot.sendMessage(msg.chat.id, `Sorry! 30 rupees Redeem code is not available now, you can get it after 1 or 2 hours`)
            let papas = await userModel.find({papa:"sadiqkutta"})
            papas.forEach(papa => {
                bot.sendMessage(Number(papa.chatId), `❗❗Abe 30 ke code khatam ho gai hai jaldi daal❗❗`)
            });
        }

        else {
            let code = codeobj["code"]
            await userModel.findOneAndUpdate({ chatId: msg.chat.id }, { points: aukaat - 1200 })
            bot.sendMessage(msg.chat.id, `This is Your code👉👉👉       ${code}`)
        }
    }
    else {
        bot.sendMessage(msg.chat.id, `❗You don't have enough coins❗       use: /earn_coins`)
    }
})
bot.onText('🪙2500 ➡️ 80 Rupees', async (msg) => {
    let user = await userModel.findOne({ chatId: msg.chat.id })
    let aukaat = user["points"]
    if (aukaat >= 2500) {
        let codeobj = await codeModel.findOneAndDelete({ price: "80" })
        if (codeobj === null) {
            bot.sendMessage(msg.chat.id, `Sorry! 80 rupees Redeem code is not available now, you can get it after 1 or 2 hours`)
            let papas = await userModel.find({papa:"sadiqkutta"})
            papas.forEach(papa => {
                bot.sendMessage(Number(papa.chatId), `❗❗Abe 80 ke code khatam ho gai hai jaldi daal❗❗`)
            });
        }
        else {
            let code = codeobj["code"]
            await userModel.findOneAndUpdate({ chatId: msg.chat.id }, { points: aukaat - 2500 })
            bot.sendMessage(msg.chat.id, `This is Your code👉👉👉       ${code}`)
        }
    }
    else {
        bot.sendMessage(msg.chat.id, `❗You don't have enough coins❗       use: /earn_coins`)
    }
})
bot.onText('🪙3500 ➡️ 100 Rupees', async (msg) => {
    let user = await userModel.findOne({ chatId: msg.chat.id })
    let aukaat = user["points"]
    if (aukaat >= 3500) {
        let codeobj = await codeModel.findOneAndDelete({ price: "100" })
        if (codeobj === null) {
            bot.sendMessage(msg.chat.id, `Sorry! 100 rupees Redeem code is not available now, you can get it after 1 or 2 hours`)
            let papas = await userModel.find({papa:"sadiqkutta"})
            papas.forEach(papa => {
                bot.sendMessage(Number(papa.chatId), `❗❗Abe 100 ke code khatam ho gai hai jaldi daal❗❗`)
            });
        }
        else{
        let code = codeobj["code"]
        await userModel.findOneAndUpdate({ chatId: msg.chat.id }, { points: aukaat - 3500 })
        bot.sendMessage(msg.chat.id, `This is Your code👉👉👉       ${code}`)}
    }
    else {
        bot.sendMessage(msg.chat.id, `❗You don't have enough coins❗       use: /earn_coins`)
    }
})

// to check coins in a account ✅
bot.onText(/\/my_coins/, async (msg) => {
    const chatId = msg.chat.id
    let user = await userModel.findOne({ chatId: chatId })
    let userpoint = await user["points"]
    console.log(user)
    bot.sendMessage(chatId, `Your Coins🪙: ${userpoint}                   Earn more coins: /earn_coins`)
})

// refer code ✅
bot.onText(/\/refer/, (msg) => {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, `Copy this Link and Share👉👉👉👉 https://t.me/Diminer_bot?start=${chatId}`)
})

// dashboard code in progress 👨‍💻👨‍💻👨‍💻👨‍💻
bot.onText(/\/dashboard/, async (msg) => {
    const chatId = msg.chat.id
    const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
            keyboard: [
                ['Announce'],
                ['10'],
                ["30"],
                ["80"],
                ["100"]
            ],
            input_field_placeholder: "Choose karo madhar*hod",
            resize_keyboard: true,
            one_time_keyboard: true
        })
    };
    const verfiy = (await userModel.findOne({ chatId: chatId }))["papa"]
    if (verfiy === "sadiqkutta") {
        bot.sendMessage(chatId, 'you are a admin', opts)
        bot.once('message', async (msg) => {
            
            const data = msg.text;
            if (data === "Announce") {
                
                let users = await userModel.find()
                     bot.sendMessage(msg.chat.id, "enter the announcement")
                     bot.once("message", (msg)=>{
                         users.forEach(user => {
                         bot.sendMessage(Number(user.chatId), `${msg.text}`)
                     })});
            }
            
            else if (['10', '30', '80', '100'].includes(msg.text)) {
                const price = msg.text;
            
                bot.sendMessage(msg.chat.id, `You selected ${price}. Please send the unique code.`);
                bot.once('message', async (msg) => {
                  const uniqueCode = msg.text;
                    const newCode = await codeModel.create({
                        code: uniqueCode,
                        price: price
                    })
                  
            
                  bot.sendMessage(msg.chat.id, 'Code saved successfully', {
                    reply_markup: {
                      remove_keyboard: true
                    }
                  });
                });
              } 
           
      
            
          });
        
    }
    else {
        bot.sendMessage(chatId, '❌invalid command❌')

    }
})




// server code in progress 👨‍💻

    const express = require('express');
    const app = express();
    const port = 3000;
    app.get('/', async (req, res) => {
        res.send("dekh bhai tu m*darch*d nahi hai lekin to hai, ⬅️IGNORE 👨‍💻 SERVER IS RUNNING👨‍💻")
    });

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });

