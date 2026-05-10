fetch("https://hub.linux.do/admin/marketplace/channels?page=1&first=20&search=gpt-5.5&tag=all&sort=multiplier_asc", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "authorization": "Bearer ",
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

载荷：
page
1
first
20
search
gpt-5.5
tag
all
sort
multiplier_asc

响应：
{
    "items": [
        {
            "id": "gid://axonhub/Channel/6713",
            "name": "GPT5.5",
            "type": "openai",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "gpt-5.5"
            ],
            "createdAt": "2026-05-09T02:11:27.505645Z",
            "budgetPolicy": "display_only",
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
                "id": "gid://axonhub/User/2497",
                "firstName": "Baihu",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/baihu/288/538784_2.png",
                "linuxdoUsername": "Baihu"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.525
        },
        {
            "id": "gid://axonhub/Channel/5768",
            "name": "Open_CPA",
            "type": "openai",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "gpt-5.5",
                "gpt-5.4-mini",
                "gpt-5.3-codex",
                "gpt-5.3-codex-spark",
                "gpt-5.4"
            ],
            "createdAt": "2026-05-06T07:50:24.717332Z",
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
                "id": "gid://axonhub/User/14375",
                "firstName": "zhongfei",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/zhongfei/288/386689_2.png",
                "linuxdoUsername": "zhongfei"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.5278089887640449
        },
        {
            "id": "gid://axonhub/Channel/5151",
            "name": "ailinyu",
            "type": "openai",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "gpt-5.3-codex",
                "gpt-5.2",
                "gpt-image-2",
                "gpt-5.5",
                "gpt-5.4-mini",
                "gpt-5.4"
            ],
            "createdAt": "2026-05-05T07:00:44.313552Z",
            "budgetPolicy": "display_only",
            "budgetAmount": 0,
            "budgetStats": {
                "hasBudget": true,
                "budgetAmount": 0,
                "consumedAmount": 0,
                "remainingAmount": 0,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/1662",
                "firstName": "xiaoyan ",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/xiaoyan/288/1763539_2.png",
                "linuxdoUsername": "xiaoyan"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.5285112359550562
        },
        {
            "id": "gid://axonhub/Channel/7256",
            "name": "dufu",
            "type": "openai",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "gpt-5.3-codex",
                "gpt-5.4",
                "gpt-5.4-mini",
                "gpt-5.5"
            ],
            "createdAt": "2026-05-10T11:15:28.882211Z",
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
                "id": "gid://axonhub/User/16520",
                "firstName": "yusialone",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/yusialone/288/1888274_2.png",
                "linuxdoUsername": "yusialone"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.5271067415730337
        },
        {
            "id": "gid://axonhub/Channel/5111",
            "name": "kodu",
            "type": "openai",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": true,
            "remark": "",
            "supportedModels": [
                "text-embedding-ada-002",
                "whisper-1",
                "gpt-3.5-turbo",
                "tts-1",
                "gpt-3.5-turbo-16k",
                "davinci-002",
                "babbage-002",
                "gpt-3.5-turbo-instruct",
                "gpt-3.5-turbo-instruct-0914",
                "dall-e-3",
                "dall-e-2",
                "gpt-3.5-turbo-1106",
                "tts-1-hd",
                "tts-1-1106",
                "tts-1-hd-1106",
                "text-embedding-3-small",
                "text-embedding-3-large",
                "gpt-3.5-turbo-0125",
                "gpt-4o",
                "gpt-4o-2024-05-13",
                "gpt-4o-mini-2024-07-18",
                "gpt-4o-mini",
                "gpt-4o-2024-08-06",
                "gpt-4o-audio-preview",
                "omni-moderation-latest",
                "omni-moderation-2024-09-26",
                "gpt-4o-audio-preview-2024-12-17",
                "gpt-4o-mini-audio-preview-2024-12-17",
                "o1-2024-12-17",
                "o1",
                "gpt-4o-mini-audio-preview",
                "o3-mini",
                "o3-mini-2025-01-31",
                "gpt-4o-2024-11-20",
                "gpt-4o-mini-search-preview-2025-03-11",
                "gpt-4o-mini-search-preview",
                "gpt-4o-transcribe",
                "gpt-4o-mini-transcribe",
                "gpt-4o-mini-tts",
                "o3-2025-04-16",
                "o4-mini-2025-04-16",
                "o3",
                "o4-mini",
                "gpt-4.1-2025-04-14",
                "gpt-4.1",
                "gpt-4.1-mini-2025-04-14",
                "gpt-4.1-mini",
                "gpt-4.1-nano-2025-04-14",
                "gpt-4.1-nano",
                "gpt-image-1",
                "gpt-4o-audio-preview-2025-06-03",
                "gpt-4o-transcribe-diarize",
                "gpt-5-chat-latest",
                "gpt-5-2025-08-07",
                "gpt-5",
                "gpt-5-mini-2025-08-07",
                "gpt-5-mini",
                "gpt-5-nano-2025-08-07",
                "gpt-5-nano",
                "gpt-audio-2025-08-28",
                "gpt-realtime",
                "gpt-realtime-2025-08-28",
                "gpt-audio",
                "gpt-5-codex",
                "gpt-image-1-mini",
                "gpt-5-pro-2025-10-06",
                "gpt-5-pro",
                "gpt-audio-mini",
                "gpt-audio-mini-2025-10-06",
                "gpt-5-search-api",
                "gpt-realtime-mini",
                "gpt-realtime-mini-2025-10-06",
                "sora-2",
                "sora-2-pro",
                "gpt-5-search-api-2025-10-14",
                "gpt-5.1-chat-latest",
                "gpt-5.1-2025-11-13",
                "gpt-5.1",
                "gpt-5.1-codex",
                "gpt-5.1-codex-mini",
                "gpt-5.1-codex-max",
                "gpt-image-1.5",
                "gpt-5.2-2025-12-11",
                "gpt-5.2",
                "gpt-5.2-pro-2025-12-11",
                "gpt-5.2-pro",
                "gpt-5.2-chat-latest",
                "gpt-4o-mini-transcribe-2025-12-15",
                "gpt-4o-mini-transcribe-2025-03-20",
                "gpt-4o-mini-tts-2025-03-20",
                "gpt-4o-mini-tts-2025-12-15",
                "gpt-realtime-mini-2025-12-15",
                "gpt-audio-mini-2025-12-15",
                "chatgpt-image-latest",
                "gpt-5.2-codex",
                "gpt-5.3-codex",
                "gpt-realtime-1.5",
                "gpt-audio-1.5",
                "gpt-4o-search-preview",
                "gpt-4o-search-preview-2025-03-11",
                "gpt-5.3-chat-latest",
                "gpt-5.4-2026-03-05",
                "gpt-5.4-pro",
                "gpt-5.4-pro-2026-03-05",
                "gpt-5.4",
                "gpt-5.4-nano-2026-03-17",
                "gpt-5.4-nano",
                "gpt-5.4-mini-2026-03-17",
                "gpt-5.4-mini",
                "gpt-image-2",
                "gpt-image-2-2026-04-21",
                "gpt-5.5",
                "gpt-5.5-2026-04-23",
                "gpt-5.5-pro",
                "gpt-5.5-pro-2026-04-23",
                "chat-latest",
                "gpt-realtime-translate",
                "gpt-realtime-2",
                "gpt-realtime-whisper"
            ],
            "createdAt": "2026-05-05T05:03:04.01Z",
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
                "id": "gid://axonhub/User/12226",
                "firstName": "SuperO",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/letter_avatar/supero/288/5_c16b2ee14fe83ed9a59fc65fbec00f85.png",
                "linuxdoUsername": "SuperO"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.6578651685393259
        },
        {
            "id": "gid://axonhub/Channel/185",
            "name": "opena",
            "type": "openai",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": true,
            "remark": "",
            "supportedModels": [
                "text-embedding-ada-002",
                "whisper-1",
                "gpt-3.5-turbo",
                "tts-1",
                "gpt-3.5-turbo-16k",
                "davinci-002",
                "babbage-002",
                "gpt-3.5-turbo-instruct",
                "gpt-3.5-turbo-instruct-0914",
                "dall-e-3",
                "dall-e-2",
                "gpt-3.5-turbo-1106",
                "tts-1-hd",
                "tts-1-1106",
                "tts-1-hd-1106",
                "text-embedding-3-small",
                "text-embedding-3-large",
                "gpt-3.5-turbo-0125",
                "gpt-4o",
                "gpt-4o-2024-05-13",
                "gpt-4o-mini-2024-07-18",
                "gpt-4o-mini",
                "gpt-4o-2024-08-06",
                "gpt-4o-audio-preview",
                "omni-moderation-latest",
                "omni-moderation-2024-09-26",
                "gpt-4o-audio-preview-2024-12-17",
                "gpt-4o-mini-audio-preview-2024-12-17",
                "o1-2024-12-17",
                "o1",
                "gpt-4o-mini-audio-preview",
                "o3-mini",
                "o3-mini-2025-01-31",
                "gpt-4o-2024-11-20",
                "gpt-4o-mini-search-preview-2025-03-11",
                "gpt-4o-mini-search-preview",
                "gpt-4o-transcribe",
                "gpt-4o-mini-transcribe",
                "gpt-4o-mini-tts",
                "o3-2025-04-16",
                "o4-mini-2025-04-16",
                "o3",
                "o4-mini",
                "gpt-4.1-2025-04-14",
                "gpt-4.1",
                "gpt-4.1-mini-2025-04-14",
                "gpt-4.1-mini",
                "gpt-4.1-nano-2025-04-14",
                "gpt-4.1-nano",
                "gpt-image-1",
                "gpt-4o-audio-preview-2025-06-03",
                "gpt-4o-transcribe-diarize",
                "gpt-5-chat-latest",
                "gpt-5-2025-08-07",
                "gpt-5",
                "gpt-5-mini-2025-08-07",
                "gpt-5-mini",
                "gpt-5-nano-2025-08-07",
                "gpt-5-nano",
                "gpt-audio-2025-08-28",
                "gpt-realtime",
                "gpt-realtime-2025-08-28",
                "gpt-audio",
                "gpt-5-codex",
                "gpt-image-1-mini",
                "gpt-5-pro-2025-10-06",
                "gpt-5-pro",
                "gpt-audio-mini",
                "gpt-audio-mini-2025-10-06",
                "gpt-5-search-api",
                "gpt-realtime-mini",
                "gpt-realtime-mini-2025-10-06",
                "sora-2",
                "sora-2-pro",
                "gpt-5-search-api-2025-10-14",
                "gpt-5.1-chat-latest",
                "gpt-5.1-2025-11-13",
                "gpt-5.1",
                "gpt-5.1-codex",
                "gpt-5.1-codex-mini",
                "gpt-5.1-codex-max",
                "gpt-image-1.5",
                "gpt-5.2-2025-12-11",
                "gpt-5.2",
                "gpt-5.2-pro-2025-12-11",
                "gpt-5.2-pro",
                "gpt-5.2-chat-latest",
                "gpt-4o-mini-transcribe-2025-12-15",
                "gpt-4o-mini-transcribe-2025-03-20",
                "gpt-4o-mini-tts-2025-03-20",
                "gpt-4o-mini-tts-2025-12-15",
                "gpt-realtime-mini-2025-12-15",
                "gpt-audio-mini-2025-12-15",
                "chatgpt-image-latest",
                "gpt-5.2-codex",
                "gpt-5.3-codex",
                "gpt-realtime-1.5",
                "gpt-audio-1.5",
                "gpt-4o-search-preview",
                "gpt-4o-search-preview-2025-03-11",
                "gpt-5.3-chat-latest",
                "gpt-5.4-2026-03-05",
                "gpt-5.4-pro",
                "gpt-5.4-pro-2026-03-05",
                "gpt-5.4",
                "gpt-5.4-nano-2026-03-17",
                "gpt-5.4-nano",
                "gpt-5.4-mini-2026-03-17",
                "gpt-5.4-mini",
                "gpt-image-2",
                "gpt-image-2-2026-04-21",
                "gpt-5.5",
                "gpt-5.5-2026-04-23",
                "gpt-5.5-pro",
                "gpt-5.5-pro-2026-04-23",
                "chat-latest",
                "gpt-realtime-translate",
                "gpt-realtime-2",
                "gpt-realtime-whisper"
            ],
            "createdAt": "2026-04-20T01:41:13.018088Z",
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
                "id": "gid://axonhub/User/1803",
                "firstName": "half-c",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/half-c/288/393395_2.png",
                "linuxdoUsername": "half-c"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.6578651685393259
        },
        {
            "id": "gid://axonhub/Channel/3947",
            "name": "openai001",
            "type": "openai_responses",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "g p t",
                "gpt-5.5",
                "gpt-5.4",
                "gpt-5.4-mini",
                "gpt-5.3-codex",
                "gpt-5.3-codex-spark",
                "gpt-5.2",
                "gpt-image-2"
            ],
            "createdAt": "2026-04-27T15:35:22.071923Z",
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
                "id": "gid://axonhub/User/9822",
                "firstName": "Amesky",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/amesky/288/364556_2.png",
                "linuxdoUsername": "Amesky"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.5299157303370786
        },
        {
            "id": "gid://axonhub/Channel/4048",
            "name": "swyel",
            "type": "codex",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "gpt-5.5",
                "gpt-5.4",
                "gpt-5.4-mini",
                "gpt-5.3-codex",
                "gpt-5.2"
            ],
            "createdAt": "2026-04-28T02:29:09.480804Z",
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
                "id": "gid://axonhub/User/4663",
                "firstName": "是我又饿了",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/misaki-su/288/1824825_2.png",
                "linuxdoUsername": "misaki-su"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.5278089887640449
        },
        {
            "id": "gid://axonhub/Channel/691",
            "name": "xem",
            "type": "openai",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "z-ai/glm-5.1",
                "gpt-5.3-codex-spark",
                "moonshotai/kimi-k2-instruct",
                "gpt-5.4",
                "gpt-5.3-codex",
                "deepseek-ai/deepseek-v4-flash",
                "moonshotai/kimi-k2-thinking",
                "gpt-5.5-pro",
                "gpt-5.2-openai-compact",
                "z-ai/glm4.7",
                "gpt-5.4-openai-compact",
                "minimaxai/minimax-m2.7",
                "gpt-5.4-mini",
                "claude-opus-4-7",
                "deepseek-ai/deepseek-v3.1-terminus",
                "minimaxai/minimax-m2.5",
                "gpt-5.2",
                "deepseek-v4-pro",
                "deepseek-ai/deepseek-v4-pro",
                "gpt-5.5",
                "gpt-5.3-codex-openai-compact",
                "moonshotai/kimi-k2.5",
                "moonshotai/kimi-k2-instruct-0905",
                "stepfun-ai/step-3.5-flash",
                "mimo-v2-flash",
                "gpt-image-2",
                "deepseek-ai/deepseek-v3.1",
                "xem-5.4",
                "z-ai/glm5",
                "deepseek-v4-flash",
                "deepseek-ai/deepseek-v3.2"
            ],
            "createdAt": "2026-04-20T13:35:10.306546Z",
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
                "id": "gid://axonhub/User/4099",
                "firstName": "cong0707",
                "lastName": "",
                "avatar": "https://linux.do/user_avatar/linux.do/cong0707/288/322754_2.png",
                "linuxdoUsername": "cong0707"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.5460674157303371
        },
        {
            "id": "gid://axonhub/Channel/1574",
            "name": "xzx",
            "type": "codex",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": true,
            "remark": "",
            "supportedModels": [
                "gpt-5.4",
                "gpt-5.5"
            ],
            "createdAt": "2026-04-21T05:32:31.650231Z",
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
                "id": "gid://axonhub/User/2837",
                "firstName": "大熊",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/xzx/288/128845_2.png",
                "linuxdoUsername": "xzx"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.5757022471910113
        },
        {
            "id": "gid://axonhub/Channel/1090",
            "name": "不知道定价多少，最低价就完事了",
            "type": "openai",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "不知道定价多少，最低价就完事了",
            "supportedModels": [
                "gpt-5.4-mini",
                "gpt-5.4",
                "gpt-5.3-codex",
                "gpt-5.5"
            ],
            "createdAt": "2026-04-20T17:41:34.309622Z",
            "budgetPolicy": "display_only",
            "budgetStats": {
                "hasBudget": false,
                "budgetAmount": 0,
                "consumedAmount": 1.70320767,
                "remainingAmount": -1.70320767,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/4710",
                "firstName": "Xielaoban",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/letter_avatar/xielaoban/288/5_c16b2ee14fe83ed9a59fc65fbec00f85.png",
                "linuxdoUsername": "xielaoban"
            },
            "priceSummary": {
                "allFree": true,
                "hasPrices": false
            },
            "score": 0.45265221453820476
        },
        {
            "id": "gid://axonhub/Channel/5074",
            "name": "【低价】0.01倍 低价国模 不限量",
            "type": "openai",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "claude-3-5-haiku-20241022",
                "claude-3-5-sonnet-20240620",
                "claude-3-5-sonnet-20241022",
                "claude-3-7-sonnet-20250219",
                "claude-3-7-sonnet-20250219-thinking",
                "claude-3-haiku-20240307",
                "claude-3-opus-20240229",
                "claude-3-sonnet-20240229",
                "claude-haiku-4-5-20251001",
                "claude-opus-4-1-20250805",
                "claude-opus-4-1-20250805-thinking",
                "claude-opus-4-20250514",
                "claude-opus-4-20250514-thinking",
                "claude-opus-4-5-20251101",
                "claude-opus-4-5-20251101-thinking",
                "claude-opus-4-6",
                "claude-opus-4-6-high",
                "claude-opus-4-6-low",
                "claude-opus-4-6-max",
                "claude-opus-4-6-medium",
                "claude-opus-4-7",
                "claude-opus-4-7-high",
                "claude-opus-4-7-low",
                "claude-opus-4-7-max",
                "claude-opus-4-7-medium",
                "claude-opus-4-7-thinking",
                "claude-opus-4-7-xhigh",
                "claude-sonnet-4-20250514",
                "claude-sonnet-4-20250514-thinking",
                "claude-sonnet-4-5-20250929",
                "claude-sonnet-4-5-20250929-thinking",
                "claude-sonnet-4-6",
                "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
                "deepseek-r1-7",
                "deepseek-v4-flash",
                "deepseek-v4-flash-nothinking",
                "deepseek-v4-flash-search",
                "deepseek-v4-flash-search-nothinking",
                "deepseek-v4-pro",
                "deepseek-v4-pro-nothinking",
                "deepseek-v4-pro-search",
                "deepseek-v4-pro-search-nothinking",
                "deepseek-v4-vision",
                "deepseek-v4-vision-nothinking",
                "glm-5",
                "glm-5.1",
                "glm5-bd",
                "google/gemma-3-12b-it:free",
                "google/gemma-3-27b-it:free",
                "google/gemma-3-4b-it:free",
                "google/gemma-3n-e2b-it:free",
                "google/gemma-3n-e4b-it:free",
                "gpt-4o",
                "gpt-5",
                "gpt-5-3-mini",
                "hunyuanocr",
                "inclusionai/ling-2.6-1t:free",
                "liquid/lfm-2.5-1.2b-instruct:free",
                "liquid/lfm-2.5-1.2b-thinking:free",
                "LongCat-2.0-Preview",
                "meta-llama/llama-3.2-3b-instruct:free",
                "meta-llama/llama-3.3-70b-instruct:free",
                "mimo-v2-flash",
                "mimo-v2-omni",
                "mimo-v2-pro",
                "mimo-v2-tts",
                "mimo-v2.5",
                "mimo-v2.5-pro",
                "mimo-v2.5-tts",
                "mimo-v2.5-tts-voiceclone",
                "mimo-v2.5-tts-voicedesign",
                "MiniMax-M2",
                "MiniMax-M2.1",
                "MiniMax-M2.1-highspeed",
                "MiniMax-M2.5",
                "MiniMax-M2.5-highspeed",
                "MiniMax-M2.7",
                "MiniMax-M2.7-highspeed",
                "nousresearch/hermes-3-llama-3.1-405b:free",
                "nvidia/nemotron-3-nano-30b-a3b:free",
                "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
                "nvidia/nemotron-3-super-120b-a12b:free",
                "nvidia/nemotron-nano-12b-v2-vl:free",
                "nvidia/nemotron-nano-9b-v2:free",
                "openai/gpt-oss-120b:free",
                "openrouter/free",
                "poolside/laguna-m.1:free",
                "poolside/laguna-xs.2:free",
                "qwen-image-2512",
                "qwen/qwen3-next-80b-a3b-instruct:free",
                "qwen3.5-4",
                "tencent/hy3-preview:free",
                "z-ai/glm-4.5-air:free",
                "arctic-embed-l",
                "bge-m3",
                "codegemma-1.1-7b",
                "codegemma-7b",
                "codellama-70b",
                "codestral-22b-instruct-v0.1",
                "cosmos-reason2-8b",
                "dbrx-instruct",
                "deepseek-coder-6.7b-instruct",
                "deepseek-r1",
                "deepseek-r1-fold",
                "deepseek-r1-search",
                "deepseek-r1-silent",
                "deepseek-search",
                "deepseek-search-silent",
                "deepseek-think",
                "deepseek-v3.1-terminus",
                "deepseek-v3.2",
                "deplot",
                "devstral-2-123b-instruct-2512",
                "dracarys-llama-3.1-70b-instruct",
                "embed-qa-4",
                "gemini-3-flash",
                "gemini-3.1-pro",
                "gemma-2-2b-it",
                "gemma-2b",
                "gemma-3-12b-it",
                "gemma-3-27b-it",
                "gemma-3-4b-it",
                "gemma-3n-e2b-it",
                "gemma-3n-e4b-it",
                "gemma-4-31b-it",
                "gliner-pii",
                "glm4.7",
                "glm5",
                "gpt-5.2",
                "gpt-5.4",
                "gpt-5.4-mini",
                "gpt-5.5",
                "gpt-oss-120b",
                "gpt-oss-20b",
                "granite-3.0-3b-a800m-instruct",
                "granite-3.0-8b-instruct",
                "granite-34b-code-instruct",
                "granite-8b-code-instruct",
                "grok-3",
                "grok-3-mini",
                "grok-4-0709",
                "grok-4-1-fast-non-reasoning",
                "grok-4-1-fast-reasoning",
                "grok-4-fast-non-reasoning",
                "grok-4-fast-reasoning",
                "grok-4.20-0309-non-reasoning",
                "grok-4.20-0309-reasoning",
                "grok-4.20-multi-agent-0309",
                "ising-calibration-1-35b-a3b",
                "jamba-1.5-large-instruct",
                "kimi-k2-instruct-0905",
                "kimi-k2-thinking",
                "kimi-k2.5",
                "kimi-k2.6",
                "kosmos-2",
                "llama-3.1-405b-instruct",
                "llama-3.1-70b-instruct",
                "llama-3.1-8b-instruct",
                "llama-3.1-nemoguard-8b-content-safety",
                "llama-3.1-nemoguard-8b-topic-control",
                "llama-3.1-nemotron-51b-instruct",
                "llama-3.1-nemotron-70b-instruct",
                "llama-3.1-nemotron-nano-8b-v1",
                "llama-3.1-nemotron-nano-vl-8b-v1",
                "llama-3.1-nemotron-safety-guard-8b-v3",
                "llama-3.1-nemotron-ultra-253b-v1",
                "llama-3.2-11b-vision-instruct",
                "llama-3.2-1b-instruct",
                "llama-3.2-3b-instruct",
                "llama-3.2-90b-vision-instruct",
                "llama-3.2-nemoretriever-1b-vlm-embed-v1",
                "llama-3.2-nemoretriever-300m-embed-v1",
                "llama-3.2-nv-embedqa-1b-v1",
                "llama-3.2-nv-embedqa-1b-v2",
                "llama-3.3-70b-instruct",
                "llama-3.3-nemotron-super-49b-v1",
                "llama-3.3-nemotron-super-49b-v1.5",
                "llama-4-maverick-17b-128e-instruct",
                "llama-guard-4-12b",
                "llama-nemotron-embed-1b-v2",
                "llama-nemotron-embed-vl-1b-v2",
                "llama2-70b",
                "llama3-chatqa-1.5-70b",
                "magistral-small-2506",
                "ministral-14b-instruct-2512",
                "mistral-7b-instruct-v0.3",
                "mistral-large",
                "mistral-large-2-instruct",
                "mistral-large-3-675b-instruct-2512",
                "mistral-medium-3-instruct",
                "mistral-nemo-12b-instruct",
                "mistral-nemo-minitron-8b-8k-instruct",
                "mistral-nemotron",
                "mistral-small-4-119b-2603",
                "mixtral-8x22b-instruct-v0.1",
                "mixtral-8x22b-v0.1",
                "mixtral-8x7b-instruct-v0.1",
                "moonshot-v1-32k-vision-preview",
                "nemoretriever-parse",
                "nemotron-3-content-safety",
                "nemotron-3-nano-30b-a3b",
                "nemotron-3-super-120b-a12b",
                "nemotron-4-340b-instruct",
                "nemotron-4-340b-reward",
                "nemotron-content-safety-reasoning-4b",
                "nemotron-mini-4b-instruct",
                "nemotron-nano-12b-v2-vl",
                "nemotron-nano-3-30b-a3b",
                "nemotron-parse",
                "neva-22b",
                "nv-embed-v1",
                "nv-embedcode-7b-v1",
                "nv-embedqa-e5-v5",
                "nv-embedqa-mistral-7b-v2",
                "nvclip",
                "nvidia-nemotron-nano-9b-v2",
                "palmyra-creative-122b",
                "palmyra-fin-70b-32k",
                "palmyra-med-70b",
                "palmyra-med-70b-32k",
                "phi-3-vision-128k-instruct",
                "phi-3.5-moe-instruct",
                "phi-4-mini-instruct",
                "phi-4-multimodal-instruct",
                "qianfan-ocr-fast",
                "qwen2.5-coder-32b-instruct",
                "qwen3-coder",
                "qwen3-coder-480b-a35b-instruct",
                "qwen3-next-80b-a3b-instruct",
                "qwen3-next-80b-a3b-thinking",
                "qwen3.5-122b-a10b",
                "qwen3.5-397b-a17b",
                "recurrentgemma-2b",
                "riva-translate-4b-instruct",
                "riva-translate-4b-instruct-v1.1",
                "sarvam-m",
                "sea-lion-7b-instruct",
                "seed-oss-36b-instruct",
                "solar-10.7b-instruct",
                "starcoder2-15b",
                "step-3.5-flash",
                "stockmark-2-100b-instruct",
                "vila",
                "yi-large",
                "zamba2-7b-instruct",
                "doubao-seed-2.0-code",
                "doubao-seed-2.0-pro"
            ],
            "createdAt": "2026-05-05T04:02:47.586979Z",
            "budgetPolicy": "display_only",
            "budgetAmount": 10000000,
            "budgetStats": {
                "hasBudget": true,
                "budgetAmount": 10000000,
                "consumedAmount": 0.256022836,
                "remainingAmount": 9999999.743977165,
                "consumedRatio": 2.56022836e-8
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/12006",
                "firstName": "夜影星辰",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/yeying-xingchen/288/1915162_2.png",
                "linuxdoUsername": "yeying-xingchen"
            },
            "priceSummary": {
                "input": {
                    "min": 0,
                    "max": 0.15
                },
                "output": {
                    "min": 0,
                    "max": 0.75
                },
                "cacheRead": {
                    "min": 0,
                    "max": 0.015
                },
                "cacheWrite": {
                    "min": 0,
                    "max": 0.1875
                },
                "inputMultiplier": {
                    "min": 0,
                    "max": 0.010416666666666666
                },
                "outputMultiplier": {
                    "min": 0,
                    "max": 0.010069444444444445
                },
                "cacheReadMultiplier": {
                    "min": 0,
                    "max": 0.010714285714285713
                },
                "cacheWriteMultiplier": {
                    "min": 0,
                    "max": 0
                },
                "multiplier": {
                    "min": 0,
                    "max": 0.010416666666666666
                },
                "allFree": false,
                "hasPrices": true
            },
            "score": 0.6228347026946558
        },
        {
            "id": "gid://axonhub/Channel/6285",
            "name": "免费，随便蹬，5.5",
            "type": "openai",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "gpt-5.2",
                "gpt-5.5",
                "gpt-5.4-mini",
                "gpt-5.4",
                "gpt-5.3-codex"
            ],
            "createdAt": "2026-05-07T11:18:29.244519Z",
            "budgetPolicy": "display_only",
            "budgetStats": {
                "hasBudget": false,
                "budgetAmount": 0,
                "consumedAmount": 0.5657467800000009,
                "remainingAmount": -0.5657467800000009,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/4710",
                "firstName": "Xielaoban",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/letter_avatar/xielaoban/288/5_c16b2ee14fe83ed9a59fc65fbec00f85.png",
                "linuxdoUsername": "xielaoban"
            },
            "priceSummary": {
                "input": {
                    "min": 0.01,
                    "max": 0.01
                },
                "output": {
                    "min": 0.01,
                    "max": 0.01
                },
                "cacheRead": {
                    "min": 0.01,
                    "max": 0.01
                },
                "inputMultiplier": {
                    "min": 0.002,
                    "max": 0.013333333333333334
                },
                "outputMultiplier": {
                    "min": 0.0003333333333333333,
                    "max": 0.0022222222222222222
                },
                "cacheReadMultiplier": {
                    "min": 0.02,
                    "max": 0.13333333333333333
                },
                "multiplier": {
                    "min": 0.0003333333333333333,
                    "max": 0.013333333333333334
                },
                "allFree": false,
                "hasPrices": true
            },
            "score": 0.45298810512505217
        },
        {
            "id": "gid://axonhub/Channel/6738",
            "name": "0.01倍codex",
            "type": "codex",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "gpt-5.4-mini",
                "gpt-5.4",
                "gpt-5.3-codex",
                "gpt-5.2",
                "gpt-5.5"
            ],
            "createdAt": "2026-05-09T03:31:56.547183Z",
            "budgetPolicy": "display_only",
            "budgetAmount": 10000,
            "budgetStats": {
                "hasBudget": true,
                "budgetAmount": 10000,
                "consumedAmount": 4.955696052699976,
                "remainingAmount": 9995.0443039473,
                "consumedRatio": 0.00049556960527
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/5720",
                "firstName": "长安",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/1420970597/288/1068201_2.png",
                "linuxdoUsername": "1420970597"
            },
            "priceSummary": {
                "input": {
                    "min": 0.0075,
                    "max": 0.05
                },
                "output": {
                    "min": 0.045,
                    "max": 0.3
                },
                "cacheRead": {
                    "min": 0.0008,
                    "max": 0.005
                },
                "inputMultiplier": {
                    "min": 0.01,
                    "max": 0.01
                },
                "outputMultiplier": {
                    "min": 0.01,
                    "max": 0.01
                },
                "cacheReadMultiplier": {
                    "min": 0.009714285714285713,
                    "max": 0.010666666666666668
                },
                "multiplier": {
                    "min": 0.01,
                    "max": 0.01
                },
                "allFree": false,
                "hasPrices": true
            },
            "score": 0.45439046390675575
        },
        {
            "id": "gid://axonhub/Channel/6605",
            "name": "CPA白给GPT5.5",
            "type": "openai_responses",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "gpt-5.5"
            ],
            "createdAt": "2026-05-08T14:34:36.938762Z",
            "budgetPolicy": "hard_limit",
            "budgetAmount": 10,
            "budgetStats": {
                "hasBudget": true,
                "budgetAmount": 10,
                "consumedAmount": 0.940633010000001,
                "remainingAmount": 9.05936699,
                "consumedRatio": 0.0940633010000001
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/9389",
                "firstName": "bonjour",
                "lastName": "fqq",
                "avatar": "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtcnVsZT0iZXZlbm9kZCIgaGVpZ2h0PSIxZW0iIHN0eWxlPSJmbGV4Om5vbmU7bGluZS1oZWlnaHQ6MSIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMWVtIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0aXRsZT5EZWVwU2VlazwvdGl0bGU+PHBhdGggZD0iTTIzLjc0OCA0LjQ4MmMtLjI1NC0uMTI0LS4zNjQuMTEzLS41MTIuMjM0LS4wNTEuMDM5LS4wOTQuMDktLjEzNy4xMzYtLjM3Mi4zOTctLjgwNi42NTctMS4zNzMuNjI2LS44MjktLjA0Ni0xLjUzNy4yMTQtMi4xNjMuODQ4LS4xMzMtLjc4Mi0uNTc1LTEuMjQ4LTEuMjQ3LTEuNTQ4LS4zNTItLjE1Ni0uNzA4LS4zMTEtLjk1NS0uNjUtLjE3Mi0uMjQxLS4yMTktLjUxLS4zMDUtLjc3NC0uMDU1LS4xNi0uMTEtLjMyMy0uMjkzLS4zNS0uMi0uMDMxLS4yNzguMTM2LS4zNTYuMjc2LS4zMTMuNTcyLS40MzQgMS4yMDItLjQyMiAxLjg0LjAyNyAxLjQzNi42MzMgMi41OCAxLjgzOCAzLjM5My4xMzcuMDkzLjE3Mi4xODcuMTI5LjMyMy0uMDgyLjI4LS4xOC41NTItLjI2Ni44MzMtLjA1NS4xNzktLjEzNy4yMTctLjMyOS4xNGE1LjUyNiA1LjUyNiAwIDAxLTEuNzM2LTEuMThjLS44NTctLjgyOC0xLjYzMS0xLjc0Mi0yLjU5Ny0yLjQ1OGExMS4zNjUgMTEuMzY1IDAgMDAtLjY4OS0uNDcxYy0uOTg1LS45NTcuMTMtMS43NDMuMzg4LTEuODM2LjI3LS4wOTguMDkzLS40MzItLjc3OS0uNDI4LS44NzIuMDA0LTEuNjcuMjk1LTIuNjg3LjY4NGEzLjA1NSAzLjA1NSAwIDAxLS40NjUuMTM3IDkuNTk3IDkuNTk3IDAgMDAtMi44ODMtLjEwMmMtMS44ODUuMjEtMy4zOSAxLjEwMi00LjQ5NyAyLjYyM0MuMDgyIDguNjA2LS4yMzEgMTAuNjg0LjE1MiAxMi44NWMuNDAzIDIuMjg0IDEuNTY5IDQuMTc1IDMuMzYgNS42NTMgMS44NTggMS41MzMgMy45OTcgMi4yODQgNi40MzggMi4xNCAxLjQ4Mi0uMDg1IDMuMTMzLS4yODQgNC45OTQtMS44Ni40Ny4yMzQuOTYyLjMyNyAxLjc4LjM5Ny42My4wNTkgMS4yMzYtLjAzIDEuNzA1LS4xMjguNzM1LS4xNTYuNjg0LS44MzcuNDE5LS45NjEtMi4xNTUtMS4wMDQtMS42ODItLjU5NS0yLjExMy0uOTI2IDEuMDk2LTEuMjk2IDIuNzQ2LTIuNjQyIDMuMzkyLTcuMDAzLjA1LS4zNDcuMDA3LS41NjUgMC0uODQ1LS4wMDQtLjE3LjAzNS0uMjM3LjIzLS4yNTZhNC4xNzMgNC4xNzMgMCAwMDEuNTQ1LS40NzVjMS4zOTYtLjc2MyAxLjk2LTIuMDE1IDIuMDkzLTMuNTE3LjAyLS4yMy0uMDA0LS40NjctLjI0Ny0uNTg4ek0xMS41ODEgMThjLTIuMDg5LTEuNjQyLTMuMTAyLTIuMTgzLTMuNTItMi4xNi0uMzkyLjAyNC0uMzIxLjQ3MS0uMjM1Ljc2My4wOS4yODguMjA3LjQ4Ni4zNzEuNzM5LjExNC4xNjcuMTkyLjQxNi0uMTEzLjYwMy0uNjczLjQxNi0xLjg0Mi0uMTQtMS44OTctLjE2Ny0xLjM2MS0uODAyLTIuNS0xLjg2LTMuMzAxLTMuMzA3LS43NzQtMS4zOTMtMS4yMjQtMi44ODctMS4yOTgtNC40ODItLjAyLS4zODYuMDkzLS41MjIuNDc3LS41OTJhNC42OTYgNC42OTYgMCAwMTEuNTI5LS4wMzljMi4xMzIuMzEyIDMuOTQ2IDEuMjY1IDUuNDY4IDIuNzc0Ljg2OC44NiAxLjUyNSAxLjg4NyAyLjIwMiAyLjg5MS43MiAxLjA2NiAxLjQ5NCAyLjA4MiAyLjQ4IDIuOTE0LjM0OC4yOTIuNjI1LjUxNC44OTEuNjc3LS44MDIuMDktMi4xNC4xMS0zLjA1NC0uNjE0em0xLTYuNDRhLjMwNi4zMDYgMCAwMS40MTUtLjI4Ny4zMDIuMzAyIDAgMDEuMi4yODguMzA2LjMwNiAwIDAxLS4zMS4zMDcuMzAzLjMwMyAwIDAxLS4zMDQtLjMwOHptMy4xMSAxLjU5NmMtLjIuMDgxLS4zOTkuMTUxLS41OS4xNmExLjI0NSAxLjI0NSAwIDAxLS43OTgtLjI1NGMtLjI3NC0uMjMtLjQ3LS4zNTgtLjU1Mi0uNzU4YTEuNzMgMS43MyAwIDAxLjAxNi0uNTg4Yy4wNy0uMzI3LS4wMDgtLjUzNy0uMjM5LS43MjctLjE4Ny0uMTU2LS40MjYtLjE5OS0uNjg4LS4xOTlhLjU1OS41NTkgMCAwMS0uMjU0LS4wNzhjLS4xMS0uMDU0LS4yLS4xOS0uMTE0LS4zNTguMDI4LS4wNTQuMTYtLjE4Ni4xOTItLjIxLjM1Ni0uMjAyLjc2Ny0uMTM2IDEuMTQ2LjAxNi4zNTIuMTQ0LjYxOC40MDggMS4wMDEuNzgyLjM5MS40NTEuNDYyLjU3Ni42ODUuOTE0LjE3Ni4yNjUuMzM2LjUzNy40NDUuODQ4LjA2Ny4xOTUtLjAxOS4zNTQtLjI1LjQ1MnoiPjwvcGF0aD48L3N2Zz4=",
                "linuxdoUsername": "jlweb"
            },
            "priceSummary": {
                "input": {
                    "min": 0.05,
                    "max": 0.05
                },
                "output": {
                    "min": 0.3,
                    "max": 0.3
                },
                "cacheRead": {
                    "min": 0.005,
                    "max": 0.005
                },
                "inputMultiplier": {
                    "min": 0.01,
                    "max": 0.01
                },
                "outputMultiplier": {
                    "min": 0.01,
                    "max": 0.01
                },
                "cacheReadMultiplier": {
                    "min": 0.01,
                    "max": 0.01
                },
                "multiplier": {
                    "min": 0.01,
                    "max": 0.01
                },
                "allFree": false,
                "hasPrices": true
            },
            "score": 0.45029532294738267
        },
        {
            "id": "gid://axonhub/Channel/6790",
            "name": "gogo(0.01X)",
            "type": "codex",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "gpt-5.5",
                "gpt-5.4",
                "gpt-5.4-mini",
                "gpt-5.3-codex"
            ],
            "createdAt": "2026-05-09T05:41:05.507957Z",
            "budgetPolicy": "display_only",
            "budgetAmount": 49.99,
            "budgetStats": {
                "hasBudget": true,
                "budgetAmount": 49.99,
                "consumedAmount": 0.48292637500000013,
                "remainingAmount": 49.507073625,
                "consumedRatio": 0.0096604595919184
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/8067",
                "firstName": "Achaha",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/letter_avatar/achaha/288/5_c16b2ee14fe83ed9a59fc65fbec00f85.png",
                "linuxdoUsername": "achaha"
            },
            "priceSummary": {
                "input": {
                    "min": 0.0075,
                    "max": 0.0625
                },
                "output": {
                    "min": 0.045,
                    "max": 0.5
                },
                "cacheRead": {
                    "min": 0.0025,
                    "max": 0.005
                },
                "cacheWrite": {
                    "min": 0,
                    "max": 0
                },
                "inputMultiplier": {
                    "min": 0.01,
                    "max": 0.01
                },
                "outputMultiplier": {
                    "min": 0.01,
                    "max": 0.01
                },
                "cacheReadMultiplier": {
                    "min": 0.01,
                    "max": 0.01
                },
                "multiplier": {
                    "min": 0.01,
                    "max": 0.01
                },
                "allFree": false,
                "hasPrices": true
            },
            "score": 0.4522554465502473
        },
        {
            "id": "gid://axonhub/Channel/6853",
            "name": "自用0.01倍codex",
            "type": "openai_responses",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "gpt-5.4-mini",
                "gpt-5.4",
                "gpt-5.3-codex",
                "gpt-5.2",
                "gpt-5.5"
            ],
            "createdAt": "2026-05-09T08:23:41.763187Z",
            "budgetPolicy": "display_only",
            "budgetStats": {
                "hasBudget": false,
                "budgetAmount": 0,
                "consumedAmount": 5.4975495547000195,
                "remainingAmount": -5.4975495547000195,
                "consumedRatio": 0
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/5720",
                "firstName": "长安",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/1420970597/288/1068201_2.png",
                "linuxdoUsername": "1420970597"
            },
            "priceSummary": {
                "input": {
                    "min": 0.0075,
                    "max": 0.05
                },
                "output": {
                    "min": 0.045,
                    "max": 0.3
                },
                "cacheRead": {
                    "min": 0.0008,
                    "max": 0.005
                },
                "inputMultiplier": {
                    "min": 0.01,
                    "max": 0.01
                },
                "outputMultiplier": {
                    "min": 0.01,
                    "max": 0.01
                },
                "cacheReadMultiplier": {
                    "min": 0.009714285714285713,
                    "max": 0.010666666666666668
                },
                "multiplier": {
                    "min": 0.01,
                    "max": 0.01
                },
                "allFree": false,
                "hasPrices": true
            },
            "score": 0.45456403679060137
        },
        {
            "id": "gid://axonhub/Channel/7204",
            "name": "0.02X 5.5plus",
            "type": "codex",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "gpt-5.3-codex",
                "gpt-5.4",
                "gpt-5.4-mini",
                "gpt-5.5"
            ],
            "createdAt": "2026-05-10T08:16:17.424794Z",
            "budgetPolicy": "display_only",
            "budgetAmount": 100,
            "budgetStats": {
                "hasBudget": true,
                "budgetAmount": 100,
                "consumedAmount": 0.09999962000000001,
                "remainingAmount": 99.90000038,
                "consumedRatio": 0.0009999962
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/1272",
                "firstName": "504error",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/504error/288/1180677_2.png",
                "linuxdoUsername": "504error"
            },
            "priceSummary": {
                "input": {
                    "min": 0.015,
                    "max": 0.1
                },
                "output": {
                    "min": 0.09,
                    "max": 0.6
                },
                "cacheRead": {
                    "min": 0.0015,
                    "max": 0.01
                },
                "cacheWrite": {
                    "min": 0,
                    "max": 0
                },
                "inputMultiplier": {
                    "min": 0.02,
                    "max": 0.02
                },
                "outputMultiplier": {
                    "min": 0.02,
                    "max": 0.02
                },
                "cacheReadMultiplier": {
                    "min": 0.02,
                    "max": 0.02
                },
                "multiplier": {
                    "min": 0.02,
                    "max": 0.02
                },
                "allFree": false,
                "hasPrices": true
            },
            "score": 0.4521205259671422
        },
        {
            "id": "gid://axonhub/Channel/7209",
            "name": "0.02X GPT-5.5",
            "type": "codex",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "",
            "supportedModels": [
                "gpt-5.3-codex",
                "gpt-5.4",
                "gpt-5.4-mini",
                "gpt-5.5"
            ],
            "createdAt": "2026-05-10T08:31:45.404723Z",
            "budgetPolicy": "display_only",
            "budgetAmount": 40,
            "budgetStats": {
                "hasBudget": true,
                "budgetAmount": 40,
                "consumedAmount": 0.04956685,
                "remainingAmount": 39.95043315,
                "consumedRatio": 0.00123917125
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/1272",
                "firstName": "504error",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/504error/288/1180677_2.png",
                "linuxdoUsername": "504error"
            },
            "priceSummary": {
                "input": {
                    "min": 0.015,
                    "max": 0.1
                },
                "output": {
                    "min": 0.09,
                    "max": 0.6
                },
                "cacheRead": {
                    "min": 0.005,
                    "max": 0.01
                },
                "cacheWrite": {
                    "min": 0,
                    "max": 0
                },
                "inputMultiplier": {
                    "min": 0.02,
                    "max": 0.02
                },
                "outputMultiplier": {
                    "min": 0.02,
                    "max": 0.02
                },
                "cacheReadMultiplier": {
                    "min": 0.02,
                    "max": 0.02
                },
                "multiplier": {
                    "min": 0.02,
                    "max": 0.02
                },
                "allFree": false,
                "hasPrices": true
            },
            "score": 0.452104370749363
        },
        {
            "id": "gid://axonhub/Channel/6819",
            "name": "低价gpt5.5（0.02倍率）（0.01倍率用完了，这个勉强渠道保证稳定，但是会慢点）",
            "type": "openai_responses",
            "status": "enabled",
            "visibility": "public",
            "usesOfficialBaseURL": false,
            "remark": "200刀的额度，0.02倍率，额度用完就会暂时下了，刷新再上（禁测活）",
            "supportedModels": [
                "gpt-5.5",
                "gpt-5.4-mini",
                "gpt-5.3-codex",
                "gpt-5.4"
            ],
            "createdAt": "2026-05-09T08:12:34.016355Z",
            "budgetPolicy": "display_only",
            "budgetAmount": 200,
            "budgetStats": {
                "hasBudget": true,
                "budgetAmount": 200,
                "consumedAmount": 10.878790618000002,
                "remainingAmount": 189.121209382,
                "consumedRatio": 0.05439395309
            },
            "settings": {
                "codingAgentMode": "off"
            },
            "user": {
                "id": "gid://axonhub/User/15953",
                "firstName": "周易",
                "lastName": "",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/pandyzhouyi/288/1835843_2.png",
                "linuxdoUsername": "pandyzhouyi"
            },
            "priceSummary": {
                "input": {
                    "min": 0.015,
                    "max": 0.1
                },
                "output": {
                    "min": 0.09,
                    "max": 0.6
                },
                "cacheRead": {
                    "min": 0.0015,
                    "max": 0.01
                },
                "inputMultiplier": {
                    "min": 0.02,
                    "max": 0.02
                },
                "outputMultiplier": {
                    "min": 0.02,
                    "max": 0.02
                },
                "cacheReadMultiplier": {
                    "min": 0.02,
                    "max": 0.02
                },
                "multiplier": {
                    "min": 0.02,
                    "max": 0.02
                },
                "allFree": false,
                "hasPrices": true
            },
            "score": 0.4555733150161874
        }
    ],
    "totalCount": 353,
    "page": 1,
    "pageSize": 20,
    "totalPages": 18
}