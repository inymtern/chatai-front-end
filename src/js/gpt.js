const gptUrl = "https://api.openai.com/v1/chat/completions"

export function streamChat(key, messages, onDataReceived) {
    fetch(gptUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + key
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo-16k',
            messages: messages,
            temperature: 1,
            stream: true
        })
    })
        .then(response => {
            if (!response.ok) {
                window.toastr.error('请求GPT接口失败， 请检查您的代理或账户配额')
                return
            }
            const decoder = new TextDecoder();
            const reader = response.body.getReader();
            function read() {
                reader.read().then(({ done, value }) => {
                    if (done) {
                        return;
                    }
                    const data = decoder.decode(value);
                    onDataReceived(data);
                    read();
                });
            }
            // 开始读取数据
            read();
        })
        .catch(error => {
            console.error('请求错误:', error);
        });
}


export function withoutContext(msg, prompt) {
    const arr = [

        {
            role: 'user',
            content: msg
        }
    ]
    if (prompt) {
        arr.unshift({
            role: 'system',
            content: prompt
        })
    }
    return arr
}

export function withContext(records, prompt) {
    const context = getLastFiveItems(records)
    const context1 = context.map(e => {
        return {
            role: e.left ? 'assistant' : 'user',
            content: e.text
        }
    })
    if (prompt) {
        context1.unshift({
            role: 'system',
            content: prompt
        })
    }


    return context1
}


function getLastFiveItems(array) {
    if (array.length <= 5) {
        return array;
    } else {
        return array.slice(-5);
    }
}