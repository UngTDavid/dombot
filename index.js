require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,
    ],
});
client.on('ready', (c)=>{
    console.log(`${c.user.tag}`)
})
client.on('messageCreate',(message) =>{
    if(message.content == "/getLatest"){
        fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${process.env.PUUID}/ids?start=0&count=1&api_key=${process.env.RIOTAPI}`)
        .then(response=>{
            return response.json();
        })
        .then(match=>{
            console.log(match);
            fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/${match}?api_key=${process.env.RIOTAPI}`)
                .then(response=>{
                    return response.json();
                })
                .then(data => {
                    var domData = data.info.participants;
                    domData = domData.filter(a => a.puuid == process.env.PUUID);
                    var win = domData[0].win ? 'won' : 'lost'
                     const giphy = {
                        baseURL: "https://api.giphy.com/v1/gifs/",
                        apiKey: "0UTRbFtkMxAplrohufYco5IY74U8hOes",
                        tag: "sad",
                        type: "random",
                        rating: "pg-13"
                    };
                    // Giphy API URL
                    let giphyURL = encodeURI(
                        giphy.baseURL +
                        giphy.type +
                        "?api_key=" +
                        giphy.apiKey +
                        "&tag=" +
                        giphy.tag +
                        "&rating=" +
                        giphy.rating
                    );
                    var urlLink;
                    fetch(giphyURL)
                        .then(response =>{
                            return response.json();
                        })
                        .then(url =>{
                            console.log(url)
                            urlLink = url.data.embed_url;
                            channel.send(`Dom ${win} his latest game as ${domData[0].championName} and went ${domData[0].kills}/${domData[0].deaths}/${domData[0].assists}. ${urlLink}`)
                        })
                })
        })
    }
})
var channel;
client.on('messageCreate',(message) =>{
    if(message.content == "/channelset") {
        channel = message.channel;
        channel.send(`Listening to Dom's History`);
        riotAPIListener()
    }

})
let latestMatch = 'NA1_4701850516';
function riotAPIListener (){
    setTimeout(() => {
        fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${process.env.PUUID}/ids?start=0&count=1&api_key=${process.env.RIOTAPI}`)
            .then(response=>{
                return response.json();
            })
            .then(match =>{
                if(match[0] != latestMatch){
                    latestMatch = match
                    fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/${match}?api_key=${process.env.RIOTAPI}`)
                        .then(response=>{
                            return response.json();
                        })
                        .then(data => {
                            var domData = data.info.participants;
                            domData = domData.filter(a => a.puuid == process.env.PUUID);
                            var win = domData[0].win ? 'won' : 'lost'
                             const giphy = {
                        baseURL: "https://api.giphy.com/v1/gifs/",
                        apiKey: "0UTRbFtkMxAplrohufYco5IY74U8hOes",
                        tag: "sad",
                        type: "random",
                        rating: "pg-13"
                    };
                    // Giphy API URL
                    let giphyURL = encodeURI(
                        giphy.baseURL +
                        giphy.type +
                        "?api_key=" +
                        giphy.apiKey +
                        "&tag=" +
                        giphy.tag +
                        "&rating=" +
                        giphy.rating
                    );
                    var urlLink;
                    fetch(giphyURL)
                        .then(response =>{
                            return response.json();
                        })
                        .then(url =>{
                            console.log(url)
                            urlLink = url.data.embed_url;
                            channel.send(`Dom ${win} his latest game as ${domData[0].championName} and went ${domData[0].kills}/${domData[0].deaths}/${domData[0].assists}. ${urlLink}`)
                        })
                        })
                }
            })
        riotAPIListener()
    }, 5000)
}
client.login(process.env.DISCORD_TOKEN);
