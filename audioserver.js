const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());

const openai = new OpenAI({
    apiKey: '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'
});

app.post('/upload', (req, res) => {
    const filePath = path.join(__dirname, 'audio.mp3');
    const fileStream = fs.createWriteStream(filePath);
    req.pipe(fileStream);
    req.on('end', () => res.sendStatus(200));
});

app.get('/getTranscription', async (req, res) => {
    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream("audio.mp3"),
        model: "whisper-1"
    });
    res.json({ response: transcription.text });
});

app.post('/getGptResponse', async (req, res) => {
    const userMessages = req.body.messages;
    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: userMessages
    });

    const gptResponse = chatCompletion.choices[0].message.content;
    res.json({ response: gptResponse });
});

app.listen(4000, () => console.log('서버가 4000번 포트에서 시작되었습니다.'));
