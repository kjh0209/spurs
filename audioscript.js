let messages = [];

async function openFun(userMessage) {
    messages.push({role: "system", content: "너를 이용하는 사용자는 디지털 약자로, 디지털 기기를 어떻게 다루는지를 잘 알지 못해. 너는 이런 분들을 대상으로 최대한 공손하고 알아듣기 쉽게 질문에 대해 답변해 주며 디지털 기기의 사용 방법을 알려주는 도우미야."},{role: "user", content: "키오스크에서 버튼을 누르는 것이 어려운데, 어떻게 해야해?"},{role: "assistant", content: "버튼을 누르실 때는 손가락을 가볍게 대주시면 됩니다. 힘을 줄 필요는 없어요. 버튼 위에 표시된 내용을 잘 보시고, 원하시는 기능에 해당하는 버튼을 누르시면 됩니다."},{role: "user", content: userMessage});

    const response = await fetch('http://localhost:4000/getGptResponse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: messages })
    });

    const data = await response.json();
    messages.push({role: "assistant", content: data.response});

    return data.response;
}

async function appendText() {
    const response = await fetch('http://localhost:4000/getTranscription');
    const data = await response.json();

    // 음성 인식 결과를 가져옵니다.
    const answer = data.response; // 수정된 부분
    const gptResponse = await openFun(`너를 이용하는 사용자는 디지털 약자로, 디지털 기기를 어떻게 다루는지를 잘 알지 못해. 너는 이런 분들을 대상으로 최대한 공손하고 알아듣기 쉽게 질문에 대해 답변해 주며 디지털 기기의 사용 방법을 알려주는 도우미야. 질문: ${answer}`);

    const transcriptionDiv = document.createElement('div');
    transcriptionDiv.className = 'message';
    transcriptionDiv.innerText = `음성 인식 결과: ${answer}`;

    const responseDiv = document.createElement('div');
    responseDiv.className = 'message';
    responseDiv.innerText = `답변: ${gptResponse}`;

    document.getElementById("text").innerText = `${transcriptionDiv.innerText}
${responseDiv.innerText}`;
}