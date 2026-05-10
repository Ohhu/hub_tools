fetch("https://hub.linux.do/admin/marketplace/channels?page=1&first=20&tag=all&sort=multiplier_asc", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "authorization": "Bearer =",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"148\", \"Google Chrome\";v=\"148\", \"Not/A)Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "cookie": "",
    "Referer": "https://hub.linux.do/marketplace"
  },
  "body": null,
  "method": "GET"
});

fetch("https://hub.linux.do/admin/graphql", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "authorization": "Bearer ",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"148\", \"Google Chrome\";v=\"148\", \"Not/A)Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "cookie": "",
    "Referer": "https://hub.linux.do/marketplace"
  },
  "body": "{\"query\":\"\\n  query GetChannelProbeData($input: GetChannelProbeDataInput!) {\\n    channelProbeData(input: $input) {\\n      channelID\\n      points {\\n        timestamp\\n        totalRequestCount\\n        successRequestCount\\n        avgTokensPerSecond\\n        avgTimeToFirstTokenMs\\n      }\\n    }\\n  }\\n\",\"variables\":{\"input\":{\"channelIDs\":[\"gid://axonhub/Channel/2223\",\"gid://axonhub/Channel/2235\",\"gid://axonhub/Channel/4044\",\"gid://axonhub/Channel/4250\",\"gid://axonhub/Channel/2403\",\"gid://axonhub/Channel/1055\",\"gid://axonhub/Channel/1126\",\"gid://axonhub/Channel/5640\",\"gid://axonhub/Channel/1020\",\"gid://axonhub/Channel/182\",\"gid://axonhub/Channel/5835\",\"gid://axonhub/Channel/976\",\"gid://axonhub/Channel/5054\",\"gid://axonhub/Channel/3240\",\"gid://axonhub/Channel/1178\",\"gid://axonhub/Channel/1941\",\"gid://axonhub/Channel/189\",\"gid://axonhub/Channel/3269\",\"gid://axonhub/Channel/588\",\"gid://axonhub/Channel/591\"]}},\"operationName\":\"GetChannelProbeData\"}",
  "method": "POST"
});

载荷：
page
1
first
20
tag
all
sort
multiplier_asc

响应：
{
    "items": [
        {
            "id": "gid://axonhub/Channel/2223",
            "name": " DGB 公益站",
            "type": "openai",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "minimaxai/minimax-m2.7",
                "grok-4.20-0309",
                "moonshotai/kimi-k2.5",
                "google/gemma-4-31b-it",
                "moonshotai/kimi-k2-instruct",
                "qwen/qwen3-coder-480b-a35b-instruct",
                "z-ai/glm4.7",
                "z-ai/glm5",
                "meta/llama-3.1-405b-instruct",
                "openai/gpt-oss-120b",
                "moonshotai/kimi-k2-instruct-0905",
                "moonshotai/kimi-k2-thinking",
                "gpt-image-2",
                "grok-4.20-0309-reasoning",
                "grok-4.20-auto",
                "grok-4.20-fast",
                "grok-imagine-image-lite",
                "grok-4.20-0309-non-reasoning",
                "claude-opus-4-6-thinking",
                "claude-opus-4-7-thinking",
                "claude-sonnet-4-6",
                "claude-opus-4-7",
                "claude-opus-4-6",
                "claude-sonnet-4-6-thinking"
            ],
            "createdAt": "2026-04-22T09:11:42.661625Z",
            "budgetPolicy": "display_only",
            "budgetStats": {
                "hasBudget": false,
                "budgetAmount": 0,
                "consumedAmount": 0,
                "remainingAmount": 0,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/1524",
                "firstName": "新子讷",
                "lastName": "",
                "avatar": "https://linux.do/user_avatar/linux.do/xinzine/288/1303801_2.png",
                "linuxdoUsername": "xinzine"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.5411516853932584
        },
        {
            "id": "gid://axonhub/Channel/2235",
            "name": " Embedding \u0026 Reranker",
            "type": "openai",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "google-gemini-embedding-001",
                "Qwen/Qwen3-Reranker-8B",
                "Pro/BAAI/bge-m3",
                "Qwen/Qwen3-Embedding-4B",
                "google/gemini-embedding-001",
                "Qwen3-Reranker-4B",
                "cohere/rerank-4-fast",
                "BAAI/bge-m3",
                "nvidia/llama-nemotron-embed-1b-v2",
                "BAAI/bge-reranker-v2-m3",
                "gemini-embedding-001",
                "Qwen/Qwen3-Embedding-0.6B",
                "Qwen3-Reranker-8B",
                "half/gemini-embedding-001",
                "jina-reranker-m0",
                "voyage-4-large",
                "jina-clip-v1",
                "Qwen3-VL-Reranker-8B",
                "jina-embeddings-v4",
                "nvidia/llama-3.2-nv-embedqa-1b-v2",
                "Qwen3-Embedding-8B",
                "nvidia/llama-nemotron-embed-vl-1b-v2",
                "Qwen3-VL-Embedding-8B",
                "voyage-code-2",
                "Pro/BAAI/bge-reranker-v2-m3",
                "cohere/rerank-4-pro",
                "Qwen/Qwen3-Embedding-8B",
                "cohere/rerank-v3.5",
                "text-embedding-3-small",
                "gemini-embedding-2-preview",
                "zembed-1",
                "text-embedding-3-large",
                "nvidia/llama-3_2-nemoretriever-300m-embed-v1",
                "voyage-code-3",
                "zerank-2",
                "nomic-embed-code",
                "zerank-1",
                "voyage-4-lite",
                "zerank-1-small",
                "jina-clip-v2",
                "Qwen3-VL-Embedding-2B",
                "voyage-4",
                "Qwen/Qwen3-Reranker-0.6B",
                "Qwen/Qwen3-Reranker-4B",
                "Qwen3-VL-Reranker-2B",
                "voyage-3-lite",
                "nvidia/llama-3.2-nemoretriever-1b-vlm-embed-v1",
                "nvidia/nv-embedcode-7b-v1",
                "nvidia/nv-embedqa-e5-v5",
                "Qwen3-Embedding-4B",
                "nvidia/nv-embed-v1"
            ],
            "createdAt": "2026-04-22T09:24:27.807006Z",
            "budgetPolicy": "display_only",
            "budgetStats": {
                "hasBudget": false,
                "budgetAmount": 0,
                "consumedAmount": 0,
                "remainingAmount": 0,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/1524",
                "firstName": "新子讷",
                "lastName": "",
                "avatar": "https://linux.do/user_avatar/linux.do/xinzine/288/1303801_2.png",
                "linuxdoUsername": "xinzine"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.5601123595505618
        },
        {
            "id": "gid://axonhub/Channel/4044",
            "name": " Kimi-K2.5",
            "type": "openai",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "Kimi-K2.5"
            ],
            "createdAt": "2026-04-28T02:21:05.286402Z",
            "budgetPolicy": "display_only",
            "budgetAmount": 90,
            "budgetStats": {
                "hasBudget": true,
                "budgetAmount": 90,
                "consumedAmount": 0,
                "remainingAmount": 90,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/10020",
                "firstName": "Sherry",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/sherry77/288/1735136_2.png",
                "linuxdoUsername": "Sherry77"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.525
        },
        {
            "id": "gid://axonhub/Channel/4250",
            "name": ".Gemini[wen]",
            "type": "openai",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "gemini-2.5-flash[真流]",
                "gemini-3-flash-preview[假流]",
                "gemini-3-flash-preview[真流]",
                "deepseek-v4-flash"
            ],
            "createdAt": "2026-04-28T19:54:41.297425Z",
            "budgetPolicy": "display_only",
            "budgetStats": {
                "hasBudget": false,
                "budgetAmount": 0,
                "consumedAmount": 0,
                "remainingAmount": 0,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/5936",
                "firstName": "quantum41",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/quantum41/288/1852260_2.png",
                "linuxdoUsername": "quantum41"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.5271067415730337
        },
        {
            "id": "gid://axonhub/Channel/2403",
            "name": "0.5*plus号池",
            "type": "openai",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "gpt-5.3-codex",
                "gpt-5.4"
            ],
            "createdAt": "2026-04-22T19:44:28.186818Z",
            "budgetPolicy": "display_only",
            "budgetStats": {
                "hasBudget": false,
                "budgetAmount": 0,
                "consumedAmount": 0,
                "remainingAmount": 0,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/6159",
                "firstName": "大壮",
                "lastName": "b",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/ellar/288/1851528_2.png",
                "linuxdoUsername": "Ellar"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.5257022471910112
        },
        {
            "id": "gid://axonhub/Channel/1055",
            "name": "0421",
            "type": "minimax",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": true,
            "remark": "",
            "supportedModels": [
                "MiniMax-M2.7"
            ],
            "createdAt": "2026-04-20T16:50:23.126865Z",
            "budgetPolicy": "display_only",
            "budgetStats": {
                "hasBudget": false,
                "budgetAmount": 0,
                "consumedAmount": 0,
                "remainingAmount": 0,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/234",
                "firstName": "Hu7687",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/hu7687/288/1804001_2.png",
                "linuxdoUsername": "Hu7687"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.5750000000000001
        },
        {
            "id": "gid://axonhub/Channel/1126",
            "name": "123-123",
            "type": "nanogpt",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": true,
            "remark": "",
            "supportedModels": [
                "nvidia/Llama-3.3-Nemotron-Super-49B-v1"
            ],
            "createdAt": "2026-04-20T21:27:12.545166Z",
            "budgetPolicy": "display_only",
            "budgetStats": {
                "hasBudget": false,
                "budgetAmount": 0,
                "consumedAmount": 0,
                "remainingAmount": 0,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/4771",
                "firstName": "luck-6",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/luck-6/288/1787351_2.png",
                "linuxdoUsername": "luck-6"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.5750000000000001
        },
        {
            "id": "gid://axonhub/Channel/5316",
            "name": "18$",
            "type": "openai",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "cx/gpt-5.5",
                "cx/gpt-5.4",
                "cx/gpt-5.3-codex",
                "cx/gpt-5.2",
                "cx/gpt-5.4-mini"
            ],
            "createdAt": "2026-05-05T11:20:52.943784Z",
            "budgetPolicy": "hard_limit",
            "budgetAmount": 100,
            "budgetStats": {
                "hasBudget": true,
                "budgetAmount": 100,
                "consumedAmount": 0,
                "remainingAmount": 100,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/6315",
                "firstName": "YESR",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/yesr/288/1733495_2.png",
                "linuxdoUsername": "YESR"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.5278089887640449
        },
        {
            "id": "gid://axonhub/Channel/5640",
            "name": "29包月",
            "type": "minimax",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "MiniMax-M2.7"
            ],
            "createdAt": "2026-05-06T04:24:49.763252Z",
            "budgetPolicy": "display_only",
            "budgetStats": {
                "hasBudget": false,
                "budgetAmount": 0,
                "consumedAmount": 0,
                "remainingAmount": 0,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/6804",
                "firstName": "沙 大",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/dasha/288/569_2.png",
                "linuxdoUsername": "dasha"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.525
        },
        {
            "id": "gid://axonhub/Channel/1020",
            "name": "333",
            "type": "openai",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "z-ai/glm-5.1"
            ],
            "createdAt": "2026-04-20T16:33:15.020103Z",
            "budgetPolicy": "display_only",
            "budgetStats": {
                "hasBudget": false,
                "budgetAmount": 0,
                "consumedAmount": 0,
                "remainingAmount": 0,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/1121",
                "firstName": "Bilibili6633",
                "lastName": "",
                "avatar": "https://linux.do/user_avatar/linux.do/bilibili6633/288/1012232_2.png",
                "linuxdoUsername": "bilibili6633"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.525
        },
        {
            "id": "gid://axonhub/Channel/182",
            "name": "88code-中转",
            "type": "openai",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "gpt-5.2"
            ],
            "createdAt": "2026-04-20T01:38:40.0163Z",
            "budgetPolicy": "display_only",
            "budgetStats": {
                "hasBudget": false,
                "budgetAmount": 0,
                "consumedAmount": 0,
                "remainingAmount": 0,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/1720",
                "firstName": "Grey",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/qqppp/288/1711689_2.png",
                "linuxdoUsername": "qqppp"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.525
        },
        {
            "id": "gid://axonhub/Channel/5835",
            "name": "AAA",
            "type": "volcengine",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "deepseek-chat"
            ],
            "createdAt": "2026-05-06T09:04:33.385546Z",
            "budgetPolicy": "display_only",
            "budgetStats": {
                "hasBudget": false,
                "budgetAmount": 0,
                "consumedAmount": 0,
                "remainingAmount": 0,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/14513",
                "firstName": "Mo_calm",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/letter_avatar/mo_calm/288/5_c16b2ee14fe83ed9a59fc65fbec00f85.png",
                "linuxdoUsername": "mo_calm"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.525
        },
        {
            "id": "gid://axonhub/Channel/976",
            "name": "AIBank",
            "type": "moonshot",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "moonshotai/kimi-k2.5"
            ],
            "createdAt": "2026-04-20T15:50:38.272621Z",
            "budgetPolicy": "display_only",
            "budgetStats": {
                "hasBudget": false,
                "budgetAmount": 0,
                "consumedAmount": 0,
                "remainingAmount": 0,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/4528",
                "firstName": "霜之哀伤",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/pay/288/185827_2.png",
                "linuxdoUsername": "pay"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.525
        },
        {
            "id": "gid://axonhub/Channel/5054",
            "name": "Cb",
            "type": "cerebras",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": true,
            "remark": "",
            "supportedModels": [
                "qwen-3-235b-a22b-instruct-2507",
                "gpt-oss-120b",
                "llama3.1-8b",
                "zai-glm-4.7"
            ],
            "createdAt": "2026-05-05T03:17:00.202013Z",
            "budgetPolicy": "display_only",
            "budgetStats": {
                "hasBudget": false,
                "budgetAmount": 0,
                "consumedAmount": 0,
                "remainingAmount": 0,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/6542",
                "firstName": "鸭梨山大",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/hollowruya/288/994774_2.png",
                "linuxdoUsername": "hollowruya"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.5771067415730338
        },
        {
            "id": "gid://axonhub/Channel/3240",
            "name": "Cerabras",
            "type": "cerebras",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": true,
            "remark": "",
            "supportedModels": [
                "qwen-3-235b-a22b-instruct-2507",
                "gpt-oss-120b",
                "llama3.1-8b",
                "zai-glm-4.7"
            ],
            "createdAt": "2026-04-25T23:01:08.545601Z",
            "budgetPolicy": "display_only",
            "budgetStats": {
                "hasBudget": false,
                "budgetAmount": 0,
                "consumedAmount": 0,
                "remainingAmount": 0,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/8497",
                "firstName": "huan",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/letter_avatar/huanyu/288/5_c16b2ee14fe83ed9a59fc65fbec00f85.png",
                "linuxdoUsername": "huanyu"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.5771067415730338
        },
        {
            "id": "gid://axonhub/Channel/1178",
            "name": "DeepSeek官方",
            "type": "deepseek",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": true,
            "remark": "",
            "supportedModels": [
                "deepseek-v4-flash",
                "deepseek-v4-pro"
            ],
            "createdAt": "2026-04-21T01:22:00.668303Z",
            "budgetPolicy": "display_only",
            "budgetStats": {
                "hasBudget": false,
                "budgetAmount": 0,
                "consumedAmount": 0,
                "remainingAmount": 0,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/4851",
                "firstName": "Jack",
                "lastName": "",
                "avatar": "https://linux.do/letter_avatar/startrunning/288/5_c16b2ee14fe83ed9a59fc65fbec00f85.png",
                "linuxdoUsername": "StartRunning"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.5757022471910113
        },
        {
            "id": "gid://axonhub/Channel/1941",
            "name": "FIMALL-GLM-FLASH",
            "type": "openai",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "glm-4.7-flash"
            ],
            "createdAt": "2026-04-21T14:43:04.718713Z",
            "budgetPolicy": "display_only",
            "budgetStats": {
                "hasBudget": false,
                "budgetAmount": 0,
                "consumedAmount": 0,
                "remainingAmount": 0,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/4296",
                "firstName": "Fimall",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/fimall/288/1605114_2.png",
                "linuxdoUsername": "Fimall"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.525
        },
        {
            "id": "gid://axonhub/Channel/189",
            "name": "GLM Code Plan",
            "type": "zhipu",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": true,
            "remark": "",
            "supportedModels": [
                "glm-4.5",
                "glm-4.5-air",
                "glm-4.6",
                "glm-4.7",
                "glm-5",
                "glm-5-turbo",
                "glm-5.1"
            ],
            "createdAt": "2026-04-20T01:45:57.222826Z",
            "budgetPolicy": "display_only",
            "budgetStats": {
                "hasBudget": false,
                "budgetAmount": 0,
                "consumedAmount": 0,
                "remainingAmount": 0,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/892",
                "firstName": "同心圆",
                "lastName": "yep",
                "avatar": "https://linux.do/user_avatar/linux.do/yikfun/288/1267458_2.png",
                "linuxdoUsername": "yikfun"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.5792134831460675
        },
        {
            "id": "gid://axonhub/Channel/3269",
            "name": "GLM Coding Plan Lite官方渠道",
            "type": "zhipu",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "GLM Coding Plan Lite套餐",
            "supportedModels": [
                "GLM-5.1",
                "GLM-4.7",
                "GLM-4.6V",
                "GLM-5-Turbo",
                "GLM-4.5-Air"
            ],
            "createdAt": "2026-04-26T04:28:05.477968Z",
            "budgetPolicy": "display_only",
            "budgetStats": {
                "hasBudget": false,
                "budgetAmount": 0,
                "consumedAmount": 0,
                "remainingAmount": 0,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/1699",
                "firstName": "Dreamist",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/dreamist/288/336069_2.png",
                "linuxdoUsername": "dreamist"
            },
            "priceSummary": {
                "input": {
                    "min": 0,
                    "max": 0
                },
                "output": {
                    "min": 0,
                    "max": 0
                },
                "cacheRead": {
                    "min": 0,
                    "max": 0
                },
                "cacheWrite": {
                    "min": 0,
                    "max": 0
                },
                "inputMultiplier": {
                    "min": 0,
                    "max": 0
                },
                "outputMultiplier": {
                    "min": 0,
                    "max": 0
                },
                "cacheReadMultiplier": {
                    "min": 0,
                    "max": 0
                },
                "multiplier": {
                    "min": 0,
                    "max": 0
                },
                "allFree": true,
                "hasPrices": true
            },
            "score": 0.5278089887640449
        },
        {
            "id": "gid://axonhub/Channel/588",
            "name": "GLM-5",
            "type": "zhipu",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "glm-5"
            ],
            "createdAt": "2026-04-20T09:11:35.270396Z",
            "budgetPolicy": "display_only",
            "budgetStats": {
                "hasBudget": false,
                "budgetAmount": 0,
                "consumedAmount": 0,
                "remainingAmount": 0,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/3679",
                "firstName": "拾壹元",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/ddfls/288/1505922_2.png",
                "linuxdoUsername": "ddfls"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.525
        }
    ],
    "totalCount": 1608,
    "page": 1,
    "pageSize": 20,
    "totalPages": 81
}