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
    "x-project-id": "gid://axonhub/Project/1",
    "cookie": "__stripe_mid=",
    "Referer": "https://hub.linux.do/project/api-keys"
  },
  "body": "{\"query\":\"\\n  query GetVisibleChannelSummarys($first: Int, $after: Cursor, $orderBy: ChannelOrder, $where: ChannelWhereInput) {\\n    channels(first: $first, after: $after, orderBy: $orderBy, where: $where) {\\n      edges {\\n        node {\\n          id\\n          name\\n          type\\n          status\\n          orderingWeight\\n          tags\\n          remark\\n          allModelEntries {\\n            requestModel\\n            actualModel\\n            source\\n          }\\n        }\\n        cursor\\n      }\\n      pageInfo {\\n        hasNextPage\\n        endCursor\\n      }\\n      totalCount\\n    }\\n  }\\n\",\"variables\":{\"first\":200,\"after\":\"gaFpzRnx\",\"where\":{\"statusIn\":[\"enabled\",\"disabled\"]},\"orderBy\":{\"field\":\"ORDERING_WEIGHT\",\"direction\":\"DESC\"}},\"operationName\":\"GetVisibleChannelSummarys\"}",
  "method": "POST"
});

响应：
{
    "data": {
        "channels": {
            "edges": [
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6476",
                        "name": "自用 Codex Free",
                        "type": "openai_responses",
                        "status": "enabled",
                        "orderingWeight": 100,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpzRlMoXZk"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/4053",
                        "name": "PLUS-gpt-5.5",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 100,
                        "tags": [
                            "gpt-5.4",
                            "gpt-5.5",
                            "gpt-image-2"
                        ],
                        "remark": "我的 Plus 号池，可以使用 gpt-5.4/5.5 和image-2",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-image-2",
                                "actualModel": "gpt-image-2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpzQ/VoXZk"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/341",
                        "name": "硅基流动赠金",
                        "type": "siliconflow",
                        "status": "enabled",
                        "orderingWeight": 100,
                        "tags": [
                            "GLM",
                            "deepseek",
                            "MiniMax",
                            "kimi",
                            "Z.ai",
                            "国产模型"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "BAAI/bge-large-en-v1.5",
                                "actualModel": "BAAI/bge-large-en-v1.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "LoRA/Qwen/Qwen2.5-7B-Instruct",
                                "actualModel": "LoRA/Qwen/Qwen2.5-7B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "PaddlePaddle/PaddleOCR-VL",
                                "actualModel": "PaddlePaddle/PaddleOCR-VL",
                                "source": "direct"
                            },
                            {
                                "requestModel": "zai-org/GLM-4.5-Air",
                                "actualModel": "zai-org/GLM-4.5-Air",
                                "source": "direct"
                            },
                            {
                                "requestModel": "TeleAI/TeleSpeechASR",
                                "actualModel": "TeleAI/TeleSpeechASR",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-Reranker-8B",
                                "actualModel": "Qwen/Qwen3-Reranker-8B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "ascend-tribe/pangu-pro-moe",
                                "actualModel": "ascend-tribe/pangu-pro-moe",
                                "source": "direct"
                            },
                            {
                                "requestModel": "FunAudioLLM/CosyVoice2-0.5B",
                                "actualModel": "FunAudioLLM/CosyVoice2-0.5B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-ai/DeepSeek-V3",
                                "actualModel": "deepseek-ai/DeepSeek-V3",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Kwaipilot/KAT-Dev",
                                "actualModel": "Kwaipilot/KAT-Dev",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-VL-8B-Instruct",
                                "actualModel": "Qwen/Qwen3-VL-8B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-Omni-30B-A3B-Thinking",
                                "actualModel": "Qwen/Qwen3-Omni-30B-A3B-Thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "baidu/ERNIE-4.5-300B-A47B",
                                "actualModel": "baidu/ERNIE-4.5-300B-A47B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-Reranker-4B",
                                "actualModel": "Qwen/Qwen3-Reranker-4B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "THUDM/GLM-4-32B-0414",
                                "actualModel": "THUDM/GLM-4-32B-0414",
                                "source": "direct"
                            },
                            {
                                "requestModel": "FunAudioLLM/SenseVoiceSmall",
                                "actualModel": "FunAudioLLM/SenseVoiceSmall",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-VL-32B-Instruct",
                                "actualModel": "Qwen/Qwen3-VL-32B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-Omni-30B-A3B-Instruct",
                                "actualModel": "Qwen/Qwen3-Omni-30B-A3B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Wan-AI/Wan2.2-I2V-A14B",
                                "actualModel": "Wan-AI/Wan2.2-I2V-A14B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-30B-A3B-Instruct-2507",
                                "actualModel": "Qwen/Qwen3-30B-A3B-Instruct-2507",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Kwai-Kolors/Kolors",
                                "actualModel": "Kwai-Kolors/Kolors",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen2.5-72B-Instruct-128K",
                                "actualModel": "Qwen/Qwen2.5-72B-Instruct-128K",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-ai/DeepSeek-V3.1-Terminus",
                                "actualModel": "deepseek-ai/DeepSeek-V3.1-Terminus",
                                "source": "direct"
                            },
                            {
                                "requestModel": "inclusionAI/Ring-flash-2.0",
                                "actualModel": "inclusionAI/Ring-flash-2.0",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-235B-A22B-Instruct-2507",
                                "actualModel": "Qwen/Qwen3-235B-A22B-Instruct-2507",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen2.5-72B-Instruct",
                                "actualModel": "Qwen/Qwen2.5-72B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "internlm/internlm2_5-7b-chat",
                                "actualModel": "internlm/internlm2_5-7b-chat",
                                "source": "direct"
                            },
                            {
                                "requestModel": "LoRA/Qwen/Qwen2.5-14B-Instruct",
                                "actualModel": "LoRA/Qwen/Qwen2.5-14B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-ai/DeepSeek-R1",
                                "actualModel": "deepseek-ai/DeepSeek-R1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "moonshotai/Kimi-K2-Instruct-0905",
                                "actualModel": "moonshotai/Kimi-K2-Instruct-0905",
                                "source": "direct"
                            },
                            {
                                "requestModel": "zai-org/GLM-4.5V",
                                "actualModel": "zai-org/GLM-4.5V",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-Coder-30B-A3B-Instruct",
                                "actualModel": "Qwen/Qwen3-Coder-30B-A3B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen2.5-VL-32B-Instruct",
                                "actualModel": "Qwen/Qwen2.5-VL-32B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-8B",
                                "actualModel": "Qwen/Qwen3-8B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "PaddlePaddle/PaddleOCR-VL-1.5",
                                "actualModel": "PaddlePaddle/PaddleOCR-VL-1.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen-Image-Edit",
                                "actualModel": "Qwen/Qwen-Image-Edit",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-235B-A22B-Thinking-2507",
                                "actualModel": "Qwen/Qwen3-235B-A22B-Thinking-2507",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
                                "actualModel": "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "netease-youdao/bce-embedding-base_v1",
                                "actualModel": "netease-youdao/bce-embedding-base_v1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "LoRA/Qwen/Qwen2.5-72B-Instruct",
                                "actualModel": "LoRA/Qwen/Qwen2.5-72B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3.5-397B-A17B",
                                "actualModel": "Qwen/Qwen3.5-397B-A17B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen-Image-Edit-2509",
                                "actualModel": "Qwen/Qwen-Image-Edit-2509",
                                "source": "direct"
                            },
                            {
                                "requestModel": "IndexTeam/IndexTTS-2",
                                "actualModel": "IndexTeam/IndexTTS-2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-VL-30B-A3B-Thinking",
                                "actualModel": "Qwen/Qwen3-VL-30B-A3B-Thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-VL-235B-A22B-Instruct",
                                "actualModel": "Qwen/Qwen3-VL-235B-A22B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-VL-235B-A22B-Thinking",
                                "actualModel": "Qwen/Qwen3-VL-235B-A22B-Thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-ai/DeepSeek-OCR",
                                "actualModel": "deepseek-ai/DeepSeek-OCR",
                                "source": "direct"
                            },
                            {
                                "requestModel": "tencent/Hunyuan-A13B-Instruct",
                                "actualModel": "tencent/Hunyuan-A13B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-32B",
                                "actualModel": "Qwen/Qwen3-32B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-Embedding-4B",
                                "actualModel": "Qwen/Qwen3-Embedding-4B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-ai/DeepSeek-V3.2",
                                "actualModel": "deepseek-ai/DeepSeek-V3.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3.5-27B",
                                "actualModel": "Qwen/Qwen3.5-27B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "moonshotai/Kimi-K2-Thinking",
                                "actualModel": "moonshotai/Kimi-K2-Thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "tencent/Hunyuan-MT-7B",
                                "actualModel": "tencent/Hunyuan-MT-7B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-30B-A3B-Thinking-2507",
                                "actualModel": "Qwen/Qwen3-30B-A3B-Thinking-2507",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-Embedding-0.6B",
                                "actualModel": "Qwen/Qwen3-Embedding-0.6B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen2.5-VL-72B-Instruct",
                                "actualModel": "Qwen/Qwen2.5-VL-72B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "LoRA/Qwen/Qwen2.5-32B-Instruct",
                                "actualModel": "LoRA/Qwen/Qwen2.5-32B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "BAAI/bge-large-zh-v1.5",
                                "actualModel": "BAAI/bge-large-zh-v1.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3.5-4B",
                                "actualModel": "Qwen/Qwen3.5-4B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "stepfun-ai/Step-3.5-Flash",
                                "actualModel": "stepfun-ai/Step-3.5-Flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-Embedding-8B",
                                "actualModel": "Qwen/Qwen3-Embedding-8B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "netease-youdao/bce-reranker-base_v1",
                                "actualModel": "netease-youdao/bce-reranker-base_v1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-VL-8B-Thinking",
                                "actualModel": "Qwen/Qwen3-VL-8B-Thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B",
                                "actualModel": "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-Reranker-0.6B",
                                "actualModel": "Qwen/Qwen3-Reranker-0.6B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "THUDM/GLM-Z1-32B-0414",
                                "actualModel": "THUDM/GLM-Z1-32B-0414",
                                "source": "direct"
                            },
                            {
                                "requestModel": "THUDM/GLM-4-9B-0414",
                                "actualModel": "THUDM/GLM-4-9B-0414",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-ai/DeepSeek-V2.5",
                                "actualModel": "deepseek-ai/DeepSeek-V2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "BAAI/bge-m3",
                                "actualModel": "BAAI/bge-m3",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen2-VL-72B-Instruct",
                                "actualModel": "Qwen/Qwen2-VL-72B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3.5-35B-A3B",
                                "actualModel": "Qwen/Qwen3.5-35B-A3B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3.5-9B",
                                "actualModel": "Qwen/Qwen3.5-9B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "zai-org/GLM-4.6V",
                                "actualModel": "zai-org/GLM-4.6V",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-VL-30B-A3B-Instruct",
                                "actualModel": "Qwen/Qwen3-VL-30B-A3B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "inclusionAI/Ling-mini-2.0",
                                "actualModel": "inclusionAI/Ling-mini-2.0",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-14B",
                                "actualModel": "Qwen/Qwen3-14B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B",
                                "actualModel": "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "fnlp/MOSS-TTSD-v0.5",
                                "actualModel": "fnlp/MOSS-TTSD-v0.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "zai-org/GLM-4.6",
                                "actualModel": "zai-org/GLM-4.6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "inclusionAI/Ling-flash-2.0",
                                "actualModel": "inclusionAI/Ling-flash-2.0",
                                "source": "direct"
                            },
                            {
                                "requestModel": "THUDM/GLM-Z1-9B-0414",
                                "actualModel": "THUDM/GLM-Z1-9B-0414",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
                                "actualModel": "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "BAAI/bge-reranker-v2-m3",
                                "actualModel": "BAAI/bge-reranker-v2-m3",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen2.5-Coder-32B-Instruct",
                                "actualModel": "Qwen/Qwen2.5-Coder-32B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen2.5-32B-Instruct",
                                "actualModel": "Qwen/Qwen2.5-32B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen2.5-14B-Instruct",
                                "actualModel": "Qwen/Qwen2.5-14B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen-Image",
                                "actualModel": "Qwen/Qwen-Image",
                                "source": "direct"
                            },
                            {
                                "requestModel": "ByteDance-Seed/Seed-OSS-36B-Instruct",
                                "actualModel": "ByteDance-Seed/Seed-OSS-36B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/QwQ-32B",
                                "actualModel": "Qwen/QwQ-32B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen2.5-7B-Instruct",
                                "actualModel": "Qwen/Qwen2.5-7B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3.5-122B-A10B",
                                "actualModel": "Qwen/Qwen3.5-122B-A10B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-VL-32B-Thinking",
                                "actualModel": "Qwen/Qwen3-VL-32B-Thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-Omni-30B-A3B-Captioner",
                                "actualModel": "Qwen/Qwen3-Omni-30B-A3B-Captioner",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Wan-AI/Wan2.2-T2V-A14B",
                                "actualModel": "Wan-AI/Wan2.2-T2V-A14B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-Coder-480B-A35B-Instruct",
                                "actualModel": "Qwen/Qwen3-Coder-480B-A35B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "THUDM/GLM-4.1V-9B-Thinking",
                                "actualModel": "THUDM/GLM-4.1V-9B-Thinking",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpzQFVoXZk"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/253",
                        "name": "硅基流动PRO",
                        "type": "siliconflow",
                        "status": "enabled",
                        "orderingWeight": 100,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "GLM-5.1",
                                "actualModel": "Pro/zai-org/GLM-5.1",
                                "source": "mapping"
                            },
                            {
                                "requestModel": "MiniMax-M2.5",
                                "actualModel": "Pro/MiniMaxAI/MiniMax-M2.5",
                                "source": "mapping"
                            },
                            {
                                "requestModel": "Kimi-K2.5",
                                "actualModel": "Pro/moonshotai/Kimi-K2.5",
                                "source": "mapping"
                            },
                            {
                                "requestModel": "DeepSeek-V3.2",
                                "actualModel": "deepseek-ai/DeepSeek-V3.2",
                                "source": "mapping"
                            },
                            {
                                "requestModel": "Kimi-K2.6",
                                "actualModel": "Pro/moonshotai/Kimi-K2.6",
                                "source": "mapping"
                            }
                        ]
                    },
                    "cursor": "gqFpzP2hdmQ"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/215",
                        "name": "摸鱼",
                        "type": "codex",
                        "status": "enabled",
                        "orderingWeight": 100,
                        "tags": [
                            "gpt",
                            "codex"
                        ],
                        "remark": "自建 gpt free号池",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpzNehdmQ"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/67",
                        "name": "咸鱼鱼鱼鱼",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 100,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "glm-5.1",
                                "actualModel": "glm-5.1",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpQ6F2ZA"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/3690",
                        "name": "走过路过别错过-七夜",
                        "type": "openai_responses",
                        "status": "enabled",
                        "orderingWeight": 10,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.4-2026-03-05",
                                "actualModel": "gpt-5.4-2026-03-05",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-2",
                                "actualModel": "gpt-image-2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpzQ5qoXYK"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/639",
                        "name": "gpt-image2(柚子)",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 9,
                        "tags": [
                            "生图"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "grok-4.20-fast",
                                "actualModel": "grok-4.20-fast",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen3.6-Plus",
                                "actualModel": "Qwen3.6-Plus",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-2",
                                "actualModel": "gpt-image-2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen3.6-Max-Preview",
                                "actualModel": "Qwen3.6-Max-Preview",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpzQJ/oXYJ"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/3085",
                        "name": "公益站不限量0.1倍爽蹬",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 4,
                        "tags": [
                            "codex",
                            "gpt-5.5",
                            "gpt-5.4"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.3-codex-spark",
                                "actualModel": "gpt-5.3-codex-spark",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpzQwNoXYE"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/2853",
                        "name": "team号2 0.1倍爽蹬",
                        "type": "codex",
                        "status": "enabled",
                        "orderingWeight": 4,
                        "tags": [
                            "gpt-5.4",
                            "codex"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5",
                                "actualModel": "gpt-5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5-codex",
                                "actualModel": "gpt-5-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.1-codex",
                                "actualModel": "gpt-5.1-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.1-codex-mini",
                                "actualModel": "gpt-5.1-codex-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.1-codex-max",
                                "actualModel": "gpt-5.1-codex-max",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2-codex",
                                "actualModel": "gpt-5.2-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5-codex-mini",
                                "actualModel": "gpt-5-codex-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.1",
                                "actualModel": "gpt-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex-spark",
                                "actualModel": "gpt-5.3-codex-spark",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpzQsloXYE"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/2372",
                        "name": "自建官转plus/team池 0.05x",
                        "type": "codex",
                        "status": "enabled",
                        "orderingWeight": 3,
                        "tags": [
                            "gpt-5.4",
                            "codex",
                            "gpt-5.5"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex-spark",
                                "actualModel": "gpt-5.3-codex-spark",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-1",
                                "actualModel": "gpt-image-1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-2",
                                "actualModel": "gpt-image-2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-1.5",
                                "actualModel": "gpt-image-1.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "codex-auto-review",
                                "actualModel": "gpt-5.5",
                                "source": "mapping"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpzQlEoXYD"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6576",
                        "name": "Zhipu Coding Plan",
                        "type": "zhipu",
                        "status": "enabled",
                        "orderingWeight": 2,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "glm-4.5-air",
                                "actualModel": "glm-4.5-air",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4.6",
                                "actualModel": "glm-4.6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4.7",
                                "actualModel": "glm-4.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5",
                                "actualModel": "glm-5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5-turbo",
                                "actualModel": "glm-5-turbo",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5.1",
                                "actualModel": "glm-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4.5",
                                "actualModel": "glm-4.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpzRmwoXYC"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/4886",
                        "name": "Gemini[wen] ",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 2,
                        "tags": [
                            "gemini-3-flash-preview"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "glm4.7",
                                "actualModel": "glm4.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "kimi-k2.6",
                                "actualModel": "kimi-k2.6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "minimax-m2.7",
                                "actualModel": "minimax-m2.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-flash",
                                "actualModel": "deepseek-v4-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-2.5-flash",
                                "actualModel": "gemini-2.5-flash[真流]",
                                "source": "mapping"
                            },
                            {
                                "requestModel": "kimi-k2-thinking",
                                "actualModel": "kimi-k2-thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-3-flash-preview",
                                "actualModel": "gemini-3-flash-preview[真流]",
                                "source": "mapping"
                            },
                            {
                                "requestModel": "deepseek-v4-pro",
                                "actualModel": "deepseek-v4-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-chat",
                                "actualModel": "deepseek-chat",
                                "source": "direct"
                            },
                            {
                                "requestModel": "z-ai/glm4.7",
                                "actualModel": "z-ai/glm4.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "minimax-m2.5",
                                "actualModel": "minimax-m2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-3.1-flash-preview",
                                "actualModel": "gemini-3-flash-preview[假流]",
                                "source": "mapping"
                            },
                            {
                                "requestModel": "deepseek-reasoner",
                                "actualModel": "deepseek-reasoner",
                                "source": "direct"
                            },
                            {
                                "requestModel": "DeepSeek-V4-Pro",
                                "actualModel": "DeepSeek-V4-Pro",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpzRMWoXYC"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6599",
                        "name": "付费GPT-5.5渠道-稳定04",
                        "type": "openai_responses",
                        "status": "enabled",
                        "orderingWeight": 1,
                        "tags": [
                            "稳定第一"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpzRnHoXYB"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6431",
                        "name": "倍率-付费plus渠道-稳定第一-兜底05",
                        "type": "openai_responses",
                        "status": "enabled",
                        "orderingWeight": 1,
                        "tags": [
                            "稳定第一"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpzRkfoXYB"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6052",
                        "name": "2api(0.1x)",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 1,
                        "tags": [],
                        "remark": "自建plus 0.1倍",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-2",
                                "actualModel": "gpt-image-2",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpzRekoXYB"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5892",
                        "name": "gopay渠道（里面有五个plus）",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 1,
                        "tags": [],
                        "remark": "gopay渠道随时跑路",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex-spark",
                                "actualModel": "gpt-5.3-codex-spark",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "codex-auto-review",
                                "actualModel": "codex-auto-review",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-2",
                                "actualModel": "gpt-image-2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpzRcEoXYB"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5073",
                        "name": "codex-5.5/5.4",
                        "type": "openai_responses",
                        "status": "enabled",
                        "orderingWeight": 1,
                        "tags": [
                            "codex",
                            "gpt-5.5",
                            "gpt-5.4"
                        ],
                        "remark": "站起来蹬",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpzRPRoXYB"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/4765",
                        "name": "分享",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 1,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.1",
                                "actualModel": "gpt-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpzRKdoXYB"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/4250",
                        "name": ".Gemini[wen]",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 1,
                        "tags": [
                            "gemini-3-flash-preview"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gemini-3-flash-preview[真流]",
                                "actualModel": "gemini-3-flash-preview[真流]",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-flash",
                                "actualModel": "deepseek-v4-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-2.5-flash[真流]",
                                "actualModel": "gemini-2.5-flash[真流]",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-3-flash-preview[假流]",
                                "actualModel": "gemini-3-flash-preview[假流]",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpzRCaoXYB"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/3403",
                        "name": "随时",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 1,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "google/gemma-4-26b-a4b-it",
                                "actualModel": "google/gemma-4-26b-a4b-it",
                                "source": "direct"
                            },
                            {
                                "requestModel": "minimax/minimax-m2.5",
                                "actualModel": "minimax/minimax-m2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek/deepseek-v4-pro",
                                "actualModel": "deepseek/deepseek-v4-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "openai/gpt-oss-20b",
                                "actualModel": "openai/gpt-oss-20b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek/deepseek-v4-flash",
                                "actualModel": "deepseek/deepseek-v4-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen/qwen3-next-80b-a3b-instruct",
                                "actualModel": "qwen/qwen3-next-80b-a3b-instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "z-ai/glm-5",
                                "actualModel": "z-ai/glm-5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen/qwen3-coder",
                                "actualModel": "qwen/qwen3-coder",
                                "source": "direct"
                            },
                            {
                                "requestModel": "minimax/minimax-m2.7",
                                "actualModel": "minimax/minimax-m2.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "openai/gpt-oss-120b",
                                "actualModel": "openai/gpt-oss-120b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "meta-llama/llama-3.2-3b-instruct",
                                "actualModel": "meta-llama/llama-3.2-3b-instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "z-ai/glm-4.5-air",
                                "actualModel": "z-ai/glm-4.5-air",
                                "source": "direct"
                            },
                            {
                                "requestModel": "meta-llama/llama-3.3-70b-instruct",
                                "actualModel": "meta-llama/llama-3.3-70b-instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "z-ai/glm-5.1",
                                "actualModel": "z-ai/glm-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "google/gemma-4-31b-it",
                                "actualModel": "google/gemma-4-31b-it",
                                "source": "direct"
                            },
                            {
                                "requestModel": "moonshotai/kimi-k2.6",
                                "actualModel": "moonshotai/kimi-k2.6",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpzQ1LoXYB"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/1919",
                        "name": "官网kimi",
                        "type": "moonshot",
                        "status": "enabled",
                        "orderingWeight": 1,
                        "tags": [
                            "kimi"
                        ],
                        "remark": "Kimi官网",
                        "allModelEntries": [
                            {
                                "requestModel": "moonshot-v1-128k-vision-preview",
                                "actualModel": "moonshot-v1-128k-vision-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "kimi-k2.5",
                                "actualModel": "kimi-k2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "moonshot-v1-32k-vision-preview",
                                "actualModel": "moonshot-v1-32k-vision-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "moonshot-v1-8k-vision-preview",
                                "actualModel": "moonshot-v1-8k-vision-preview",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpzQd/oXYB"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/1846",
                        "name": "[按次计价] 讯飞星辰Coding Plan（工作日下午没法用）",
                        "type": "zai_anthropic",
                        "status": "enabled",
                        "orderingWeight": 1,
                        "tags": [
                            "glm 5.1"
                        ],
                        "remark": "【astro-code-latest】是默认的模型ID，已设置路由到glm-5.1",
                        "allModelEntries": [
                            {
                                "requestModel": "glm-5.1",
                                "actualModel": "astron-code-latest",
                                "source": "mapping"
                            }
                        ]
                    },
                    "cursor": "gqFpzQc2oXYB"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/1223",
                        "name": "minimaxi",
                        "type": "minimax",
                        "status": "enabled",
                        "orderingWeight": 1,
                        "tags": [
                            "MiniMax",
                            "Coding-Plan"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "MiniMax-M2.7",
                                "actualModel": "MiniMax-M2.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2",
                                "actualModel": "MiniMax-M2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "codex-MiniMax-M2.7",
                                "actualModel": "codex-MiniMax-M2.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.5",
                                "actualModel": "MiniMax-M2.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpzQTHoXYB"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/993",
                        "name": "橘又青的小站",
                        "type": "openai_responses",
                        "status": "enabled",
                        "orderingWeight": 1,
                        "tags": [
                            "gpt-5.4"
                        ],
                        "remark": "稳定",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpzQPhoXYB"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/274",
                        "name": "云深不知处-Codex官方订阅 NO.1",
                        "type": "codex",
                        "status": "enabled",
                        "orderingWeight": 1,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gqFpzQESoXYB"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6640",
                        "name": "ds2api",
                        "type": "deepseek",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "2api",
                        "allModelEntries": [
                            {
                                "requestModel": "deepseek-v4-flash",
                                "actualModel": "deepseek-v4-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-pro",
                                "actualModel": "deepseek-v4-pro",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRnw"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6638",
                        "name": "【Alonecloud】Foxcode",
                        "type": "anthropic",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [
                            "claude"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "claude-sonnet-4-5-20250929",
                                "actualModel": "claude-sonnet-4-5-20250929",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-haiku-4-5-20251001",
                                "actualModel": "claude-haiku-4-5-20251001",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-opus-4-1-20250805",
                                "actualModel": "claude-opus-4-1-20250805",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-opus-4-20250514",
                                "actualModel": "claude-opus-4-20250514",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-opus-4-5-20251101",
                                "actualModel": "claude-opus-4-5-20251101",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-opus-4-6",
                                "actualModel": "claude-opus-4-6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-opus-4-7",
                                "actualModel": "claude-opus-4-7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-sonnet-4-20250514",
                                "actualModel": "claude-sonnet-4-20250514",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRnu"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6637",
                        "name": "猫猫的逆向DS（free",
                        "type": "deepseek",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "deepseek-v4-flash",
                                "actualModel": "deepseek-v4-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-pro",
                                "actualModel": "deepseek-v4-pro",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRnt"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6636",
                        "name": "ollama-pro国产模型",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "glm-5.1",
                                "actualModel": "glm-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "kimi-k2.6",
                                "actualModel": "kimi-k2.6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-flash",
                                "actualModel": "deepseek-v4-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-pro",
                                "actualModel": "deepseek-v4-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "minimax-m2.7",
                                "actualModel": "minimax-m2.7",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRns"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6630",
                        "name": "官方Pro-CPA反代",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [
                            "官方"
                        ],
                        "remark": "官方Pro x5 100刀订阅",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-2",
                                "actualModel": "gpt-image-2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "codex-auto-review",
                                "actualModel": "codex-auto-review",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex-spark",
                                "actualModel": "gpt-5.3-codex-spark",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRnm"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6620",
                        "name": "小米2亿-TokenPlan",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [
                            "mimo",
                            "小米"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRnc"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6602",
                        "name": "kimi官方稳定",
                        "type": "moonshot_coding",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "kimi官方渠道",
                        "allModelEntries": [
                            {
                                "requestModel": "kimi-for-coding",
                                "actualModel": "kimi-for-coding",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRnK"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6589",
                        "name": "0.2x倍率 - Pro号池",
                        "type": "openai_responses",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [
                            "codex",
                            "gpt-5.4",
                            "gpt-5.5"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-2",
                                "actualModel": "gpt-image-2",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRm9"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6588",
                        "name": "每日余量分享",
                        "type": "openai_responses",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "项目结束抛荒了",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRm8"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6560",
                        "name": "GLM555",
                        "type": "zhipu_anthropic",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "GLM-5.1",
                                "actualModel": "GLM-5.1",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRmg"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6553",
                        "name": "官方LongCat",
                        "type": "longcat",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [
                            "LongCat"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "LongCat-Flash-Lite",
                                "actualModel": "LongCat-Flash-Lite",
                                "source": "direct"
                            },
                            {
                                "requestModel": "LongCat-Flash-Chat",
                                "actualModel": "LongCat-Flash-Chat",
                                "source": "direct"
                            },
                            {
                                "requestModel": "LongCat-Flash-Thinking-2601",
                                "actualModel": "LongCat-Flash-Thinking-2601",
                                "source": "direct"
                            },
                            {
                                "requestModel": "LongCat-Flash-Omni-2603",
                                "actualModel": "LongCat-Flash-Omni-2603",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRmZ"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6533",
                        "name": "小飞のapi",
                        "type": "openai_responses",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-image-2",
                                "actualModel": "gpt-image-2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRmF"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6531",
                        "name": "Fireworks",
                        "type": "fireworks",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "accounts/fireworks/models/kimi-k2p5",
                                "actualModel": "accounts/fireworks/models/kimi-k2p5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "accounts/fireworks/models/glm-5p1",
                                "actualModel": "accounts/fireworks/models/glm-5p1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "accounts/fireworks/models/kimi-k2p6",
                                "actualModel": "accounts/fireworks/models/kimi-k2p6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "accounts/fireworks/models/deepseek-v4-pro",
                                "actualModel": "accounts/fireworks/models/deepseek-v4-pro",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRmD"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6528",
                        "name": "kimi-test",
                        "type": "moonshot",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [
                            "kimi"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gcore/model",
                                "actualModel": "gcore/model",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRmA"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6524",
                        "name": "kiro-cc",
                        "type": "anthropic",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "kiro逆向",
                        "allModelEntries": [
                            {
                                "requestModel": "claude-opus-4-6",
                                "actualModel": "claude-opus-4-6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-opus-4-6-thinking",
                                "actualModel": "claude-opus-4-6-thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-sonnet-4-6",
                                "actualModel": "claude-sonnet-4-6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-sonnet-4-6-thinking",
                                "actualModel": "claude-sonnet-4-6-thinking",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRl8"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6521",
                        "name": "kaola",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRl5"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6515",
                        "name": "gpt-team 号池（0.1倍率）",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [
                            "team",
                            "plus",
                            "官方"
                        ],
                        "remark": "0.1倍率，个人自用team、plus号池，请勿破限",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRlz"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6513",
                        "name": "Aki plus",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRlx"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6512",
                        "name": "GLM Lite 官方 0.2x",
                        "type": "zhipu_anthropic",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "glm-4.7",
                                "actualModel": "glm-4.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5",
                                "actualModel": "glm-5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5-turbo",
                                "actualModel": "glm-5-turbo",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5.1",
                                "actualModel": "glm-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4.5",
                                "actualModel": "glm-4.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4.5-air",
                                "actualModel": "glm-4.5-air",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4.6",
                                "actualModel": "glm-4.6",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRlw"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6510",
                        "name": "官网Plus账号，内部生产级稳定中转站",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex-spark",
                                "actualModel": "gpt-5.3-codex-spark",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRlu"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6505",
                        "name": "mimo1",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts",
                                "actualModel": "mimo-v2.5-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voiceclone",
                                "actualModel": "mimo-v2.5-tts-voiceclone",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voicedesign",
                                "actualModel": "mimo-v2.5-tts-voicedesign",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-tts",
                                "actualModel": "mimo-v2-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRlp"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6486",
                        "name": "原神站0.2倍率sonnet 4.6 or渠道",
                        "type": "anthropic",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "claude-sonnet-4-6",
                                "actualModel": "claude-sonnet-4-6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-haiku-4-5-20251001",
                                "actualModel": "claude-haiku-4-5-20251001",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRlW"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6484",
                        "name": "cpa-codex-team 池",
                        "type": "codex",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "codex-auto-review",
                                "actualModel": "codex-auto-review",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-2",
                                "actualModel": "gpt-image-2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex-spark",
                                "actualModel": "gpt-5.3-codex-spark",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRlU"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6483",
                        "name": "牛牛-小米 mimo",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "小米 token 套餐 额度 2 亿",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2-tts",
                                "actualModel": "mimo-v2-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts",
                                "actualModel": "mimo-v2.5-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voiceclone",
                                "actualModel": "mimo-v2.5-tts-voiceclone",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voicedesign",
                                "actualModel": "mimo-v2.5-tts-voicedesign",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRlT"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6482",
                        "name": "flamehaze-MiniMax",
                        "type": "minimax",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "MiniMax-M2.1-highspeed",
                                "actualModel": "MiniMax-M2.1-highspeed",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2",
                                "actualModel": "MiniMax-M2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.7",
                                "actualModel": "MiniMax-M2.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.7-highspeed",
                                "actualModel": "MiniMax-M2.7-highspeed",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.5",
                                "actualModel": "MiniMax-M2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.5-highspeed",
                                "actualModel": "MiniMax-M2.5-highspeed",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.1",
                                "actualModel": "MiniMax-M2.1",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRlS"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6481",
                        "name": "0.05倍率GPT",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRlR"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6479",
                        "name": "gpt-5.4-new",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRlP"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6478",
                        "name": "z-ai/glm-5.1-new",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "glm-5.1",
                                "actualModel": "glm-5.1",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRlO"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6464",
                        "name": "siliconflow123",
                        "type": "siliconflow",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "FunAudioLLM/CosyVoice2-0.5B",
                                "actualModel": "FunAudioLLM/CosyVoice2-0.5B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "baidu/ERNIE-Image-Turbo",
                                "actualModel": "baidu/ERNIE-Image-Turbo",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-ai/DeepSeek-V3.1-Terminus",
                                "actualModel": "deepseek-ai/DeepSeek-V3.1-Terminus",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-VL-Reranker-8B",
                                "actualModel": "Qwen/Qwen3-VL-Reranker-8B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-Omni-30B-A3B-Thinking",
                                "actualModel": "Qwen/Qwen3-Omni-30B-A3B-Thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Wan-AI/Wan2.2-T2V-A14B",
                                "actualModel": "Wan-AI/Wan2.2-T2V-A14B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-30B-A3B-Thinking-2507",
                                "actualModel": "Qwen/Qwen3-30B-A3B-Thinking-2507",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen2.5-32B-Instruct",
                                "actualModel": "Qwen/Qwen2.5-32B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen2.5-7B-Instruct",
                                "actualModel": "Qwen/Qwen2.5-7B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-ai/DeepSeek-R1",
                                "actualModel": "deepseek-ai/DeepSeek-R1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-Reranker-8B",
                                "actualModel": "Qwen/Qwen3-Reranker-8B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-Embedding-8B",
                                "actualModel": "Qwen/Qwen3-Embedding-8B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "netease-youdao/bce-reranker-base_v1",
                                "actualModel": "netease-youdao/bce-reranker-base_v1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen-Image-Edit-2509",
                                "actualModel": "Qwen/Qwen-Image-Edit-2509",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-VL-Embedding-8B",
                                "actualModel": "Qwen/Qwen3-VL-Embedding-8B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3.5-35B-A3B",
                                "actualModel": "Qwen/Qwen3.5-35B-A3B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Tongyi-MAI/Z-Image-Turbo",
                                "actualModel": "Tongyi-MAI/Z-Image-Turbo",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-ai/DeepSeek-V3.2",
                                "actualModel": "deepseek-ai/DeepSeek-V3.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3.5-4B",
                                "actualModel": "Qwen/Qwen3.5-4B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-Embedding-4B",
                                "actualModel": "Qwen/Qwen3-Embedding-4B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "THUDM/GLM-Z1-9B-0414",
                                "actualModel": "THUDM/GLM-Z1-9B-0414",
                                "source": "direct"
                            },
                            {
                                "requestModel": "stepfun-ai/Step-3.5-Flash",
                                "actualModel": "stepfun-ai/Step-3.5-Flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-Omni-30B-A3B-Captioner",
                                "actualModel": "Qwen/Qwen3-Omni-30B-A3B-Captioner",
                                "source": "direct"
                            },
                            {
                                "requestModel": "tencent/Hunyuan-MT-7B",
                                "actualModel": "tencent/Hunyuan-MT-7B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "zai-org/GLM-4.5V",
                                "actualModel": "zai-org/GLM-4.5V",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-Coder-30B-A3B-Instruct",
                                "actualModel": "Qwen/Qwen3-Coder-30B-A3B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "THUDM/GLM-4-32B-0414",
                                "actualModel": "THUDM/GLM-4-32B-0414",
                                "source": "direct"
                            },
                            {
                                "requestModel": "FunAudioLLM/SenseVoiceSmall",
                                "actualModel": "FunAudioLLM/SenseVoiceSmall",
                                "source": "direct"
                            },
                            {
                                "requestModel": "BAAI/bge-m3",
                                "actualModel": "BAAI/bge-m3",
                                "source": "direct"
                            },
                            {
                                "requestModel": "PaddlePaddle/PaddleOCR-VL-1.5",
                                "actualModel": "PaddlePaddle/PaddleOCR-VL-1.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-VL-32B-Instruct",
                                "actualModel": "Qwen/Qwen3-VL-32B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "TeleAI/TeleSpeechASR",
                                "actualModel": "TeleAI/TeleSpeechASR",
                                "source": "direct"
                            },
                            {
                                "requestModel": "THUDM/GLM-4.1V-9B-Thinking",
                                "actualModel": "THUDM/GLM-4.1V-9B-Thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Kwai-Kolors/Kolors",
                                "actualModel": "Kwai-Kolors/Kolors",
                                "source": "direct"
                            },
                            {
                                "requestModel": "zai-org/GLM-4.6",
                                "actualModel": "zai-org/GLM-4.6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "THUDM/GLM-4-9B-0414",
                                "actualModel": "THUDM/GLM-4-9B-0414",
                                "source": "direct"
                            },
                            {
                                "requestModel": "moonshotai/Kimi-K2-Thinking",
                                "actualModel": "moonshotai/Kimi-K2-Thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-VL-8B-Instruct",
                                "actualModel": "Qwen/Qwen3-VL-8B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-VL-30B-A3B-Instruct",
                                "actualModel": "Qwen/Qwen3-VL-30B-A3B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen-Image-Edit",
                                "actualModel": "Qwen/Qwen-Image-Edit",
                                "source": "direct"
                            },
                            {
                                "requestModel": "ByteDance-Seed/Seed-OSS-36B-Instruct",
                                "actualModel": "ByteDance-Seed/Seed-OSS-36B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Wan-AI/Wan2.2-I2V-A14B",
                                "actualModel": "Wan-AI/Wan2.2-I2V-A14B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "tencent/Hunyuan-A13B-Instruct",
                                "actualModel": "tencent/Hunyuan-A13B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-Reranker-4B",
                                "actualModel": "Qwen/Qwen3-Reranker-4B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3.6-27B",
                                "actualModel": "Qwen/Qwen3.6-27B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "BAAI/bge-reranker-v2-m3",
                                "actualModel": "BAAI/bge-reranker-v2-m3",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-ai/DeepSeek-OCR",
                                "actualModel": "deepseek-ai/DeepSeek-OCR",
                                "source": "direct"
                            },
                            {
                                "requestModel": "zai-org/GLM-4.5-Air",
                                "actualModel": "zai-org/GLM-4.5-Air",
                                "source": "direct"
                            },
                            {
                                "requestModel": "BAAI/bge-large-zh-v1.5",
                                "actualModel": "BAAI/bge-large-zh-v1.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3.5-27B",
                                "actualModel": "Qwen/Qwen3.5-27B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "moonshotai/Kimi-K2-Instruct-0905",
                                "actualModel": "moonshotai/Kimi-K2-Instruct-0905",
                                "source": "direct"
                            },
                            {
                                "requestModel": "inclusionAI/Ring-flash-2.0",
                                "actualModel": "inclusionAI/Ring-flash-2.0",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-Reranker-0.6B",
                                "actualModel": "Qwen/Qwen3-Reranker-0.6B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "inclusionAI/Ling-flash-2.0",
                                "actualModel": "inclusionAI/Ling-flash-2.0",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-30B-A3B-Instruct-2507",
                                "actualModel": "Qwen/Qwen3-30B-A3B-Instruct-2507",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-ai/DeepSeek-V4-Flash",
                                "actualModel": "deepseek-ai/DeepSeek-V4-Flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3.6-35B-A3B",
                                "actualModel": "Qwen/Qwen3.6-35B-A3B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-VL-30B-A3B-Thinking",
                                "actualModel": "Qwen/Qwen3-VL-30B-A3B-Thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-14B",
                                "actualModel": "Qwen/Qwen3-14B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-Embedding-0.6B",
                                "actualModel": "Qwen/Qwen3-Embedding-0.6B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "fnlp/MOSS-TTSD-v0.5",
                                "actualModel": "fnlp/MOSS-TTSD-v0.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "netease-youdao/bce-embedding-base_v1",
                                "actualModel": "netease-youdao/bce-embedding-base_v1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen2.5-14B-Instruct",
                                "actualModel": "Qwen/Qwen2.5-14B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "BAAI/bge-large-en-v1.5",
                                "actualModel": "BAAI/bge-large-en-v1.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3.5-9B",
                                "actualModel": "Qwen/Qwen3.5-9B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Tongyi-MAI/Z-Image",
                                "actualModel": "Tongyi-MAI/Z-Image",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B",
                                "actualModel": "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMaxAI/MiniMax-M2.5",
                                "actualModel": "MiniMaxAI/MiniMax-M2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-VL-32B-Thinking",
                                "actualModel": "Qwen/Qwen3-VL-32B-Thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-VL-8B-Thinking",
                                "actualModel": "Qwen/Qwen3-VL-8B-Thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "inclusionAI/Ling-mini-2.0",
                                "actualModel": "inclusionAI/Ling-mini-2.0",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-32B",
                                "actualModel": "Qwen/Qwen3-32B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-8B",
                                "actualModel": "Qwen/Qwen3-8B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen2.5-72B-Instruct-128K",
                                "actualModel": "Qwen/Qwen2.5-72B-Instruct-128K",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen2.5-72B-Instruct",
                                "actualModel": "Qwen/Qwen2.5-72B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-ai/DeepSeek-V3",
                                "actualModel": "deepseek-ai/DeepSeek-V3",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3.5-122B-A10B",
                                "actualModel": "Qwen/Qwen3.5-122B-A10B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3.5-397B-A17B",
                                "actualModel": "Qwen/Qwen3.5-397B-A17B",
                                "source": "direct"
                            },
                            {
                                "requestModel": "THUDM/GLM-Z1-32B-0414",
                                "actualModel": "THUDM/GLM-Z1-32B-0414",
                                "source": "direct"
                            },
                            {
                                "requestModel": "zai-org/GLM-4.6V",
                                "actualModel": "zai-org/GLM-4.6V",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-Omni-30B-A3B-Instruct",
                                "actualModel": "Qwen/Qwen3-Omni-30B-A3B-Instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen-Image",
                                "actualModel": "Qwen/Qwen-Image",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Qwen/Qwen3-235B-A22B-Instruct-2507",
                                "actualModel": "Qwen/Qwen3-235B-A22B-Instruct-2507",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRlA"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6458",
                        "name": "token plan",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRk6"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6457",
                        "name": "prefix-minmax",
                        "type": "minimax_anthropic",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "MiniMax-M2.7",
                                "actualModel": "MiniMax-M2.7",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRk5"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6456",
                        "name": "小米7亿token",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2-tts",
                                "actualModel": "mimo-v2-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts",
                                "actualModel": "mimo-v2.5-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voiceclone",
                                "actualModel": "mimo-v2.5-tts-voiceclone",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voicedesign",
                                "actualModel": "mimo-v2.5-tts-voicedesign",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRk4"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6449",
                        "name": "gpt_image",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "codex-gpt-image-2",
                                "actualModel": "codex-gpt-image-2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-2",
                                "actualModel": "gpt-image-2",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRkx"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6437",
                        "name": "自建号池😋 IMAGE-2",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [
                            "gpt-image-2",
                            "codex-gpt-image-2",
                            "gpt-5-5",
                            "gpt-5-mini",
                            "gpt-5",
                            "gpt-5-1",
                            "gpt-5-2",
                            "gpt-5-3",
                            "gpt-5-3-mini",
                            "auto"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5-5",
                                "actualModel": "gpt-5-5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5-mini",
                                "actualModel": "gpt-5-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5-2",
                                "actualModel": "gpt-5-2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "codex-gpt-image-2",
                                "actualModel": "codex-gpt-image-2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-2",
                                "actualModel": "gpt-image-2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "auto",
                                "actualModel": "auto",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5",
                                "actualModel": "gpt-5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5-1",
                                "actualModel": "gpt-5-1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5-3",
                                "actualModel": "gpt-5-3",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5-3-mini",
                                "actualModel": "gpt-5-3-mini",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRkl"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6435",
                        "name": "hutubear(0.5官渠-自冲）",
                        "type": "deepseek",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "DeepSeek-V4-Pro",
                                "actualModel": "DeepSeek-V4-Pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "DeepSeek-V4-Flash",
                                "actualModel": "DeepSeek-V4-Flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-pro",
                                "actualModel": "DeepSeek-V4-Pro",
                                "source": "mapping"
                            },
                            {
                                "requestModel": "deepseek-v4-flash",
                                "actualModel": "DeepSeek-V4-Flash",
                                "source": "mapping"
                            }
                        ]
                    },
                    "cursor": "gaFpzRkj"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6427",
                        "name": "官_Gpt_plus5.5/5.4_号池（0.08倍率）",
                        "type": "openai_responses",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "周末了倍率调成0.08X，站起来蹬。",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRkb"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6422",
                        "name": "自用 mimo pro (x0.1)",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRkW"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6420",
                        "name": "随便蹬",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRkU"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6414",
                        "name": "new--api",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "deepseek-v4-flash",
                                "actualModel": "deepseek-v4-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-pro",
                                "actualModel": "deepseek-v4-pro",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRkO"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6410",
                        "name": "安德鲁的MIMO-MAX",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRkK"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6404",
                        "name": "ToCodeX",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "仅支持在codex中使用",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRkE"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6403",
                        "name": "sensenova",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "sensenova-6.7-flash-lite",
                                "actualModel": "sensenova-6.7-flash-lite",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-flash",
                                "actualModel": "deepseek-v4-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "sensenova-u1-fast",
                                "actualModel": "sensenova-u1-fast",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRkD"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6398",
                        "name": "Minimax",
                        "type": "minimax",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "MiniMax-M2.5",
                                "actualModel": "MiniMax-M2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.5-highspeed",
                                "actualModel": "MiniMax-M2.5-highspeed",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.1",
                                "actualModel": "MiniMax-M2.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.1-highspeed",
                                "actualModel": "MiniMax-M2.1-highspeed",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2",
                                "actualModel": "MiniMax-M2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.7",
                                "actualModel": "MiniMax-M2.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.7-highspeed",
                                "actualModel": "MiniMax-M2.7-highspeed",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRj+"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6395",
                        "name": "deepseek逆",
                        "type": "deepseek",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "deepseek-v4-flash",
                                "actualModel": "deepseek-v4-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-pro",
                                "actualModel": "deepseek-v4-pro",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRj7"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6390",
                        "name": "euzhi-gpt",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.3-codex-spark",
                                "actualModel": "gpt-5.3-codex-spark",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-2",
                                "actualModel": "gpt-image-2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRj2"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6387",
                        "name": "gpt5.5 自建pro号池！！！超级稳定便宜",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "grok-imagine-image-lite",
                                "actualModel": "grok-imagine-image-lite",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-tts",
                                "actualModel": "mimo-v2-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "grok-4.20-fast",
                                "actualModel": "grok-4.20-fast",
                                "source": "direct"
                            },
                            {
                                "requestModel": "grok-4.20-0309-non-reasoning",
                                "actualModel": "grok-4.20-0309-non-reasoning",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts",
                                "actualModel": "mimo-v2.5-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voiceclone",
                                "actualModel": "mimo-v2.5-tts-voiceclone",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voicedesign",
                                "actualModel": "mimo-v2.5-tts-voicedesign",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRjz"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6386",
                        "name": "闲置号池速蹬 0.1x 稳定 支持gpt5.5",
                        "type": "codex",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5",
                                "actualModel": "gpt-5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5-codex",
                                "actualModel": "gpt-5-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5-codex-mini",
                                "actualModel": "gpt-5-codex-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.1-codex",
                                "actualModel": "gpt-5.1-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.1-codex-max",
                                "actualModel": "gpt-5.1-codex-max",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2-codex",
                                "actualModel": "gpt-5.2-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex-spark",
                                "actualModel": "gpt-5.3-codex-spark",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.1",
                                "actualModel": "gpt-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.1-codex-mini",
                                "actualModel": "gpt-5.1-codex-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRjy"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6384",
                        "name": "官方 pro",
                        "type": "zhipu_anthropic",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "glm-4.7",
                                "actualModel": "glm-4.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5",
                                "actualModel": "glm-5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5-turbo",
                                "actualModel": "glm-5-turbo",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5.1",
                                "actualModel": "glm-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4.5",
                                "actualModel": "glm-4.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4.5-air",
                                "actualModel": "glm-4.5-air",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4.6",
                                "actualModel": "glm-4.6",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRjw"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6375",
                        "name": "super",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "11",
                        "allModelEntries": [
                            {
                                "requestModel": "claude-opus-4-6",
                                "actualModel": "claude-opus-4-6",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRjn"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6368",
                        "name": "哈哈哈",
                        "type": "bailian",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [
                            "阿里新人体验"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "qwen-72b-chat",
                                "actualModel": "qwen-72b-chat",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-pro",
                                "actualModel": "deepseek-v4-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-tts-2025-05-22",
                                "actualModel": "qwen-tts-2025-05-22",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-math-plus-latest",
                                "actualModel": "qwen-math-plus-latest",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-tts-instruct-flash-realtime-2026-01-22",
                                "actualModel": "qwen3-tts-instruct-flash-realtime-2026-01-22",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-s2s-flash-realtime-2025-09-22",
                                "actualModel": "qwen3-s2s-flash-realtime-2025-09-22",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-max-2025-09-23",
                                "actualModel": "qwen3-max-2025-09-23",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-vl-plus-2025-08-15",
                                "actualModel": "qwen-vl-plus-2025-08-15",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen1.5-110b-chat",
                                "actualModel": "qwen1.5-110b-chat",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.5-omni-plus-2026-03-15",
                                "actualModel": "qwen3.5-omni-plus-2026-03-15",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-mt-lite",
                                "actualModel": "qwen-mt-lite",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-235b-a22b-instruct-2507",
                                "actualModel": "qwen3-235b-a22b-instruct-2507",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-30b-a3b-instruct-2507",
                                "actualModel": "qwen3-30b-a3b-instruct-2507",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-vl-plus-2025-09-23",
                                "actualModel": "qwen3-vl-plus-2025-09-23",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.5",
                                "actualModel": "MiniMax-M2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-image-edit-max",
                                "actualModel": "qwen-image-edit-max",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-tts-vc-realtime-2025-11-27",
                                "actualModel": "qwen3-tts-vc-realtime-2025-11-27",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v3",
                                "actualModel": "deepseek-v3",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-r1-distill-qwen-14b",
                                "actualModel": "deepseek-r1-distill-qwen-14b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-max-longcontext",
                                "actualModel": "qwen-max-longcontext",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-r1-distill-qwen-7b",
                                "actualModel": "deepseek-r1-distill-qwen-7b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-turbo-latest",
                                "actualModel": "qwen-turbo-latest",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.6-plus",
                                "actualModel": "qwen3.6-plus",
                                "source": "direct"
                            },
                            {
                                "requestModel": "wan2.7-image",
                                "actualModel": "wan2.7-image",
                                "source": "direct"
                            },
                            {
                                "requestModel": "siliconflow/deepseek-v3-0324",
                                "actualModel": "siliconflow/deepseek-v3-0324",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-asr-flash-realtime-2025-10-27",
                                "actualModel": "qwen3-asr-flash-realtime-2025-10-27",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-tts-flash",
                                "actualModel": "qwen3-tts-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qvq-max",
                                "actualModel": "qvq-max",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-coder-plus-1106",
                                "actualModel": "qwen-coder-plus-1106",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-coder-turbo",
                                "actualModel": "qwen-coder-turbo",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax/speech-02-turbo",
                                "actualModel": "MiniMax/speech-02-turbo",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-coder-plus",
                                "actualModel": "qwen3-coder-plus",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen2.5-1.5b-instruct",
                                "actualModel": "qwen2.5-1.5b-instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-math-plus",
                                "actualModel": "qwen-math-plus",
                                "source": "direct"
                            },
                            {
                                "requestModel": "tongyi-xiaomi-analysis-flash",
                                "actualModel": "tongyi-xiaomi-analysis-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-omni-flash-realtime-2025-12-01",
                                "actualModel": "qwen3-omni-flash-realtime-2025-12-01",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-mt-plus",
                                "actualModel": "qwen-mt-plus",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen1.5-1.8b-chat",
                                "actualModel": "qwen1.5-1.8b-chat",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5.1",
                                "actualModel": "glm-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-tts-vd-2026-01-26",
                                "actualModel": "qwen3-tts-vd-2026-01-26",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-tts-vd-realtime-2025-12-16",
                                "actualModel": "qwen3-tts-vd-realtime-2025-12-16",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-image-edit-plus-2025-10-30",
                                "actualModel": "qwen-image-edit-plus-2025-10-30",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-235b-a22b-thinking-2507",
                                "actualModel": "qwen3-235b-a22b-thinking-2507",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-coder-flash",
                                "actualModel": "qwen3-coder-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-1.7b",
                                "actualModel": "qwen3-1.7b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-math-turbo-0919",
                                "actualModel": "qwen-math-turbo-0919",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax/speech-2.8-hd",
                                "actualModel": "MiniMax/speech-2.8-hd",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-image-plus-2026-01-09",
                                "actualModel": "qwen-image-plus-2026-01-09",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v3.2",
                                "actualModel": "deepseek-v3.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "ZHIPU/GLM-5.1",
                                "actualModel": "ZHIPU/GLM-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-1.8b-longcontext-chat",
                                "actualModel": "qwen-1.8b-longcontext-chat",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.6-27b",
                                "actualModel": "qwen3.6-27b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.6-35b-a3b",
                                "actualModel": "qwen3.6-35b-a3b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "vanchin/deepseek-v3.2-think",
                                "actualModel": "vanchin/deepseek-v3.2-think",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-vl-plus-2025-12-19",
                                "actualModel": "qwen3-vl-plus-2025-12-19",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-coder-plus-2025-09-23",
                                "actualModel": "qwen3-coder-plus-2025-09-23",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen2-1.5b-instruct",
                                "actualModel": "qwen2-1.5b-instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.5-omni-plus-realtime",
                                "actualModel": "qwen3.5-omni-plus-realtime",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax/MiniMax-M2.1",
                                "actualModel": "MiniMax/MiniMax-M2.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "z-image-turbo",
                                "actualModel": "z-image-turbo",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-plus-2025-04-28",
                                "actualModel": "qwen-plus-2025-04-28",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen2-57b-a14b-instruct",
                                "actualModel": "qwen2-57b-a14b-instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen2-7b-instruct",
                                "actualModel": "qwen2-7b-instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.5-omni-flash-realtime",
                                "actualModel": "qwen3.5-omni-flash-realtime",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-max-2025-01-25",
                                "actualModel": "qwen-max-2025-01-25",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen2.5-vl-32b-instruct",
                                "actualModel": "qwen2.5-vl-32b-instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-max-0919",
                                "actualModel": "qwen-max-0919",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen2.5-math-7b-instruct",
                                "actualModel": "qwen2.5-math-7b-instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.6-flash",
                                "actualModel": "qwen3.6-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-image-max-2025-12-30",
                                "actualModel": "qwen-image-max-2025-12-30",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwq-plus",
                                "actualModel": "qwq-plus",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-turbo-2025-07-15",
                                "actualModel": "qwen-turbo-2025-07-15",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen2-0.5b-instruct",
                                "actualModel": "qwen2-0.5b-instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-flash-character",
                                "actualModel": "qwen-flash-character",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-30b-a3b-thinking-2507",
                                "actualModel": "qwen3-30b-a3b-thinking-2507",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-image-2.0-pro-2026-03-03",
                                "actualModel": "qwen-image-2.0-pro-2026-03-03",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-max-2026-01-23",
                                "actualModel": "qwen3-max-2026-01-23",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-tts-flash-realtime-2025-11-27",
                                "actualModel": "qwen3-tts-flash-realtime-2025-11-27",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qvq-plus-2025-05-15",
                                "actualModel": "qvq-plus-2025-05-15",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-32b",
                                "actualModel": "qwen3-32b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-max-1201",
                                "actualModel": "qwen-max-1201",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-14b-chat",
                                "actualModel": "qwen-14b-chat",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-deep-search-planning",
                                "actualModel": "qwen-deep-search-planning",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.6-max-preview",
                                "actualModel": "qwen3.6-max-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.5-27b",
                                "actualModel": "qwen3.5-27b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-tts-instruct-flash-2026-01-26",
                                "actualModel": "qwen3-tts-instruct-flash-2026-01-26",
                                "source": "direct"
                            },
                            {
                                "requestModel": "siliconflow/deepseek-r1-0528",
                                "actualModel": "siliconflow/deepseek-r1-0528",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen2.5-coder-7b-instruct",
                                "actualModel": "qwen2.5-coder-7b-instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-tts-flash-2025-11-27",
                                "actualModel": "qwen3-tts-flash-2025-11-27",
                                "source": "direct"
                            },
                            {
                                "requestModel": "kimi-k2-thinking",
                                "actualModel": "kimi-k2-thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.5-omni-plus",
                                "actualModel": "qwen3.5-omni-plus",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-flash",
                                "actualModel": "qwen-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-vl-max-latest",
                                "actualModel": "qwen-vl-max-latest",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-vl-ocr",
                                "actualModel": "qwen-vl-ocr",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen2.5-math-72b-instruct",
                                "actualModel": "qwen2.5-math-72b-instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.5-flash",
                                "actualModel": "qwen3.5-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "siliconflow/deepseek-v3.1-terminus",
                                "actualModel": "siliconflow/deepseek-v3.1-terminus",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-vl-plus",
                                "actualModel": "qwen3-vl-plus",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-4b",
                                "actualModel": "qwen3-4b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-livetranslate-flash",
                                "actualModel": "qwen3-livetranslate-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-mt-turbo",
                                "actualModel": "qwen-mt-turbo",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-coder-plus-latest",
                                "actualModel": "qwen-coder-plus-latest",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-vl-max",
                                "actualModel": "qwen-vl-max",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.7-max",
                                "actualModel": "qwen3.7-max",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-235b-a22b",
                                "actualModel": "qwen3-235b-a22b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-r1",
                                "actualModel": "deepseek-r1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "vanchin/deepseek-ocr",
                                "actualModel": "vanchin/deepseek-ocr",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.5-omni-flash-2026-03-15",
                                "actualModel": "qwen3.5-omni-flash-2026-03-15",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-image-2.0-2026-03-03",
                                "actualModel": "qwen-image-2.0-2026-03-03",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-image-max",
                                "actualModel": "qwen-image-max",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-plus",
                                "actualModel": "qwen-plus",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-image-edit-max-2026-01-16",
                                "actualModel": "qwen-image-edit-max-2026-01-16",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-7b-chat",
                                "actualModel": "qwen-7b-chat",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-vl-max-2025-04-08",
                                "actualModel": "qwen-vl-max-2025-04-08",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen2.5-32b-instruct",
                                "actualModel": "qwen2.5-32b-instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-asr-flash-2026-02-10",
                                "actualModel": "qwen3-asr-flash-2026-02-10",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-max",
                                "actualModel": "qwen3-max",
                                "source": "direct"
                            },
                            {
                                "requestModel": "tongyi-xiaomi-analysis-pro",
                                "actualModel": "tongyi-xiaomi-analysis-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.5-plus-2026-04-20",
                                "actualModel": "qwen3.5-plus-2026-04-20",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gui-plus",
                                "actualModel": "gui-plus",
                                "source": "direct"
                            },
                            {
                                "requestModel": "codeqwen1.5-7b-chat",
                                "actualModel": "codeqwen1.5-7b-chat",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen1.5-32b-chat",
                                "actualModel": "qwen1.5-32b-chat",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-max-0107",
                                "actualModel": "qwen-max-0107",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-deep-research-2025-12-15",
                                "actualModel": "qwen-deep-research-2025-12-15",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-plus-2025-12-01",
                                "actualModel": "qwen-plus-2025-12-01",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-tts-flash-realtime",
                                "actualModel": "qwen3-tts-flash-realtime",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.5-livetranslate-flash-realtime-2026-05-19",
                                "actualModel": "qwen3.5-livetranslate-flash-realtime-2026-05-19",
                                "source": "direct"
                            },
                            {
                                "requestModel": "vanchin/deepseek-v3.1-terminus",
                                "actualModel": "vanchin/deepseek-v3.1-terminus",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.6-plus-2026-04-02",
                                "actualModel": "qwen3.6-plus-2026-04-02",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen1.5-7b-chat",
                                "actualModel": "qwen1.5-7b-chat",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qvq-max-2025-05-15",
                                "actualModel": "qvq-max-2025-05-15",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen2.5-coder-32b-instruct",
                                "actualModel": "qwen2.5-coder-32b-instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-coder-turbo-latest",
                                "actualModel": "qwen-coder-turbo-latest",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen2.5-14b-instruct",
                                "actualModel": "qwen2.5-14b-instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "kimi/kimi-k2.6",
                                "actualModel": "kimi/kimi-k2.6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "kimi-k2.6",
                                "actualModel": "kimi-k2.6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-flash-character-2026-02-26",
                                "actualModel": "qwen-flash-character-2026-02-26",
                                "source": "direct"
                            },
                            {
                                "requestModel": "siliconflow/deepseek-v3.2",
                                "actualModel": "siliconflow/deepseek-v3.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-plus-2025-11-05",
                                "actualModel": "qwen-plus-2025-11-05",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.1",
                                "actualModel": "MiniMax-M2.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen2.5-14b-instruct-1m",
                                "actualModel": "qwen2.5-14b-instruct-1m",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-coder-480b-a35b-instruct",
                                "actualModel": "qwen3-coder-480b-a35b-instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-r1-distill-qwen-1.5b",
                                "actualModel": "deepseek-r1-distill-qwen-1.5b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-asr-flash-realtime-2026-02-10",
                                "actualModel": "qwen3-asr-flash-realtime-2026-02-10",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-0.6b",
                                "actualModel": "qwen3-0.6b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-vl-plus",
                                "actualModel": "qwen-vl-plus",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-1.8b-chat",
                                "actualModel": "qwen-1.8b-chat",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-image-2.0",
                                "actualModel": "qwen-image-2.0",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-tts-vd-realtime-2026-01-15",
                                "actualModel": "qwen3-tts-vd-realtime-2026-01-15",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-tts-vc-realtime-2026-01-15",
                                "actualModel": "qwen3-tts-vc-realtime-2026-01-15",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-plus-2025-01-25",
                                "actualModel": "qwen-plus-2025-01-25",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4.7",
                                "actualModel": "glm-4.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-turbo-2024-11-01",
                                "actualModel": "qwen-turbo-2024-11-01",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-max-preview",
                                "actualModel": "qwen3-max-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qvq-plus",
                                "actualModel": "qvq-plus",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen2.5-math-1.5b-instruct",
                                "actualModel": "qwen2.5-math-1.5b-instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen2.5-0.5b-instruct",
                                "actualModel": "qwen2.5-0.5b-instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-plus-latest",
                                "actualModel": "qwen-plus-latest",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-math-turbo",
                                "actualModel": "qwen-math-turbo",
                                "source": "direct"
                            },
                            {
                                "requestModel": "wan2.7-image-pro",
                                "actualModel": "wan2.7-image-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-vl-ocr-2025-11-20",
                                "actualModel": "qwen-vl-ocr-2025-11-20",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwq-plus-2025-03-05",
                                "actualModel": "qwq-plus-2025-03-05",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-vl-plus-2025-01-25",
                                "actualModel": "qwen-vl-plus-2025-01-25",
                                "source": "direct"
                            },
                            {
                                "requestModel": "kimi/kimi-k2.5",
                                "actualModel": "kimi/kimi-k2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-image-edit-plus-2025-12-15",
                                "actualModel": "qwen-image-edit-plus-2025-12-15",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-r1-distill-qwen-32b",
                                "actualModel": "deepseek-r1-distill-qwen-32b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-14b",
                                "actualModel": "qwen3-14b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-flash",
                                "actualModel": "deepseek-v4-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.5-122b-a10b",
                                "actualModel": "qwen3.5-122b-a10b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-tts-instruct-flash",
                                "actualModel": "qwen3-tts-instruct-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-image-2.0-pro-2026-04-22",
                                "actualModel": "qwen-image-2.0-pro-2026-04-22",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5",
                                "actualModel": "glm-5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.5-397b-a17b",
                                "actualModel": "qwen3.5-397b-a17b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.5-plus-2026-02-15",
                                "actualModel": "qwen3.5-plus-2026-02-15",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-livetranslate-flash-realtime",
                                "actualModel": "qwen3-livetranslate-flash-realtime",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-r1-distill-llama-70b",
                                "actualModel": "deepseek-r1-distill-llama-70b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-max",
                                "actualModel": "qwen-max",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-omni-flash-realtime-2025-09-15",
                                "actualModel": "qwen3-omni-flash-realtime-2025-09-15",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-max-0428",
                                "actualModel": "qwen-max-0428",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen1.5-72b-chat",
                                "actualModel": "qwen1.5-72b-chat",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.5-omni-flash",
                                "actualModel": "qwen3.5-omni-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-vl-flash-2025-10-15",
                                "actualModel": "qwen3-vl-flash-2025-10-15",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-tts-flash-realtime-2025-09-18",
                                "actualModel": "qwen3-tts-flash-realtime-2025-09-18",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-vl-ocr-latest",
                                "actualModel": "qwen-vl-ocr-latest",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-long",
                                "actualModel": "qwen-long",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax/MiniMax-M2.5",
                                "actualModel": "MiniMax/MiniMax-M2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-vl-flash-2026-01-22",
                                "actualModel": "qwen3-vl-flash-2026-01-22",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-next-80b-a3b-instruct",
                                "actualModel": "qwen3-next-80b-a3b-instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-30b-a3b",
                                "actualModel": "qwen3-30b-a3b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen1.5-0.5b-chat",
                                "actualModel": "qwen1.5-0.5b-chat",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.6-flash-2026-04-16",
                                "actualModel": "qwen3.6-flash-2026-04-16",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-omni-flash-2025-12-01",
                                "actualModel": "qwen3-omni-flash-2025-12-01",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-plus-2025-09-11",
                                "actualModel": "qwen-plus-2025-09-11",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-coder-plus-2025-07-22",
                                "actualModel": "qwen3-coder-plus-2025-07-22",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-mt-flash",
                                "actualModel": "qwen-mt-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-asr-flash-realtime",
                                "actualModel": "qwen3-asr-flash-realtime",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax/speech-02-hd",
                                "actualModel": "MiniMax/speech-02-hd",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.5-flash-2026-02-23",
                                "actualModel": "qwen3.5-flash-2026-02-23",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-coder-next",
                                "actualModel": "qwen3-coder-next",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen2.5-3b-instruct",
                                "actualModel": "qwen2.5-3b-instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-next-80b-a3b-thinking",
                                "actualModel": "qwen3-next-80b-a3b-thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "vanchin/deepseek-r1",
                                "actualModel": "vanchin/deepseek-r1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-tts-instruct-flash-realtime",
                                "actualModel": "qwen3-tts-instruct-flash-realtime",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-image-edit-plus",
                                "actualModel": "qwen-image-edit-plus",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-omni-flash-2025-09-15",
                                "actualModel": "qwen3-omni-flash-2025-09-15",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen2.5-72b-instruct",
                                "actualModel": "qwen2.5-72b-instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-omni-flash-realtime",
                                "actualModel": "qwen3-omni-flash-realtime",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-max-latest",
                                "actualModel": "qwen-max-latest",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen2.5-7b-instruct-1m",
                                "actualModel": "qwen2.5-7b-instruct-1m",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-image-2.0-pro",
                                "actualModel": "qwen-image-2.0-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-8b",
                                "actualModel": "qwen3-8b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-turbo-0919",
                                "actualModel": "qwen-turbo-0919",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-math-turbo-latest",
                                "actualModel": "qwen-math-turbo-latest",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.5-omni-flash-realtime-2026-03-15",
                                "actualModel": "qwen3.5-omni-flash-realtime-2026-03-15",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.5-plus",
                                "actualModel": "qwen3.5-plus",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-omni-turbo",
                                "actualModel": "qwen-omni-turbo",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-r1-distill-llama-8b",
                                "actualModel": "deepseek-r1-distill-llama-8b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-turbo",
                                "actualModel": "qwen-turbo",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.5-omni-plus-realtime-2026-03-15",
                                "actualModel": "qwen3.5-omni-plus-realtime-2026-03-15",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-tts-flash-2025-09-18",
                                "actualModel": "qwen3-tts-flash-2025-09-18",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-omni-flash",
                                "actualModel": "qwen3-omni-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-vl-plus-latest",
                                "actualModel": "qwen-vl-plus-latest",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax/speech-2.8-turbo",
                                "actualModel": "MiniMax/speech-2.8-turbo",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-vl-max-2025-04-02",
                                "actualModel": "qwen-vl-max-2025-04-02",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen2.5-7b-instruct",
                                "actualModel": "qwen2.5-7b-instruct",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-coder-turbo-0919",
                                "actualModel": "qwen-coder-turbo-0919",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-turbo-2025-04-28",
                                "actualModel": "qwen-turbo-2025-04-28",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-tts-vc-2026-01-22",
                                "actualModel": "qwen3-tts-vc-2026-01-22",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-plus-2025-07-14",
                                "actualModel": "qwen-plus-2025-07-14",
                                "source": "direct"
                            },
                            {
                                "requestModel": "kimi-k2.5",
                                "actualModel": "kimi-k2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-vl-flash",
                                "actualModel": "qwen3-vl-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v3.1",
                                "actualModel": "deepseek-v3.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-math-plus-0919",
                                "actualModel": "qwen-math-plus-0919",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen1.5-14b-chat",
                                "actualModel": "qwen1.5-14b-chat",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.5-35b-a3b",
                                "actualModel": "qwen3.5-35b-a3b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-livetranslate-flash-realtime-2025-09-22",
                                "actualModel": "qwen3-livetranslate-flash-realtime-2025-09-22",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-vl-plus-2025-05-07",
                                "actualModel": "qwen-vl-plus-2025-05-07",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.7-max-2026-05-20",
                                "actualModel": "qwen3.7-max-2026-05-20",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3-livetranslate-flash-2025-12-01",
                                "actualModel": "qwen3-livetranslate-flash-2025-12-01",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen-coder-plus",
                                "actualModel": "qwen-coder-plus",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.5-livetranslate-flash-realtime",
                                "actualModel": "qwen3.5-livetranslate-flash-realtime",
                                "source": "direct"
                            },
                            {
                                "requestModel": "vanchin/deepseek-v3",
                                "actualModel": "vanchin/deepseek-v3",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax/MiniMax-M2.7",
                                "actualModel": "MiniMax/MiniMax-M2.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen2.5-coder-14b-instruct",
                                "actualModel": "qwen2.5-coder-14b-instruct",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRjg"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6366",
                        "name": "BXD",
                        "type": "gemini",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [
                            "BXD",
                            "Gemini"
                        ],
                        "remark": "哈基米不稳定就算了并发还很低，如遇429大概率是并发破3了，没找到地方限制并发",
                        "allModelEntries": [
                            {
                                "requestModel": "gemini-2.5-pro",
                                "actualModel": "gemini-2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-2.5-flash",
                                "actualModel": "gemini-2.5-flash",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRje"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6360",
                        "name": "Xiaomi MIMO Pro 月度套餐",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [
                            "mimo",
                            "小米"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRjY"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6351",
                        "name": "自购官渠",
                        "type": "deepseek",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [
                            "deepseek"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "deepseek-v4-flash",
                                "actualModel": "deepseek-v4-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-pro",
                                "actualModel": "deepseek-v4-pro",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRjP"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6350",
                        "name": "longcat_001",
                        "type": "longcat_anthropic",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "LongCat-Flash-Thinking",
                                "actualModel": "LongCat-Flash-Thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "LongCat-Flash-Chat",
                                "actualModel": "LongCat-Flash-Chat",
                                "source": "direct"
                            },
                            {
                                "requestModel": "LongCat-Flash-Lite",
                                "actualModel": "LongCat-Flash-Lite",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRjO"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6345",
                        "name": "95-自用号池-GPT",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRjJ"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6344",
                        "name": "95-自用号池-Gemini",
                        "type": "gemini",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gemini-3-flash-preview",
                                "actualModel": "gemini-3-flash-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-3-pro-preview",
                                "actualModel": "gemini-3-pro-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-3.1-pro-preview",
                                "actualModel": "gemini-3.1-pro-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-3.1-flash-lite-preview",
                                "actualModel": "gemini-3.1-flash-lite-preview",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRjI"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6343",
                        "name": "https://api.fireworks.ai/inference自建",
                        "type": "anthropic",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "GLM-5.1",
                                "actualModel": "accounts/fireworks/models/glm-5p1#accounts/resource-67kee6219t9/deployments/zmkyr2zr",
                                "source": "mapping"
                            }
                        ]
                    },
                    "cursor": "gaFpzRjH"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6339",
                        "name": "小 P GPT/Gemini Az 自建 0.08x",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "挂的 Azure，可测活（不能 NSFW！！）",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-4o",
                                "actualModel": "gpt-4o",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-3.1-flash-lite-preview",
                                "actualModel": "gemini-3.1-flash-lite-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-3.1-pro-preview",
                                "actualModel": "gemini-3.1-pro-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GPT-5.3-codex",
                                "actualModel": "GPT-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-nano",
                                "actualModel": "gpt-5.4-nano",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRjD"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6338",
                        "name": "小米赠送plan",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5-tts-voicedesign",
                                "actualModel": "mimo-v2.5-tts-voicedesign",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-tts",
                                "actualModel": "mimo-v2-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts",
                                "actualModel": "mimo-v2.5-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voiceclone",
                                "actualModel": "mimo-v2.5-tts-voiceclone",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRjC"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6336",
                        "name": "New API",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-2",
                                "actualModel": "gpt-image-2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRjA"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6335",
                        "name": "MY MIMO",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "doubao-seed-1-8-251228",
                                "actualModel": "doubao-seed-1-8-251228",
                                "source": "direct"
                            },
                            {
                                "requestModel": "doubao-seed-2-0-lite-260428",
                                "actualModel": "doubao-seed-2-0-lite-260428",
                                "source": "direct"
                            },
                            {
                                "requestModel": "doubao-seed-2-0-pro-260215",
                                "actualModel": "doubao-seed-2-0-pro-260215",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.7-Highspeed",
                                "actualModel": "MiniMax-M2.7-Highspeed",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v3-2-251201",
                                "actualModel": "deepseek-v3-2-251201",
                                "source": "direct"
                            },
                            {
                                "requestModel": "doubao-1-5-pro-32k-250115",
                                "actualModel": "doubao-1-5-pro-32k-250115",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRi/"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6334",
                        "name": "grok2apix",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "grok-imagine-image-lite",
                                "actualModel": "grok-imagine-image-lite",
                                "source": "direct"
                            },
                            {
                                "requestModel": "grok-4.20-0309-non-reasoning",
                                "actualModel": "grok-4.20-0309-non-reasoning",
                                "source": "direct"
                            },
                            {
                                "requestModel": "grok-4.20-fast",
                                "actualModel": "grok-4.20-fast",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRi+"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6323",
                        "name": "Gemma",
                        "type": "gemini_openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "models/gemma-4-26b-a4b-it",
                                "actualModel": "models/gemma-4-26b-a4b-it",
                                "source": "direct"
                            },
                            {
                                "requestModel": "models/gemma-4-31b-it",
                                "actualModel": "models/gemma-4-31b-it",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRiz"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6314",
                        "name": "minimax2.7年coding plan套餐",
                        "type": "minimax_anthropic",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "MiniMax-M2.5-highspeed",
                                "actualModel": "MiniMax-M2.5-highspeed",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.1",
                                "actualModel": "MiniMax-M2.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.1-highspeed",
                                "actualModel": "MiniMax-M2.1-highspeed",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2",
                                "actualModel": "MiniMax-M2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.7",
                                "actualModel": "MiniMax-M2.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.7-highspeed",
                                "actualModel": "MiniMax-M2.7-highspeed",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.5",
                                "actualModel": "MiniMax-M2.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRiq"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6308",
                        "name": "mimo-小米（5折）",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-tts",
                                "actualModel": "mimo-v2-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts",
                                "actualModel": "mimo-v2.5-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voiceclone",
                                "actualModel": "mimo-v2.5-tts-voiceclone",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voicedesign",
                                "actualModel": "mimo-v2.5-tts-voicedesign",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRik"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6292",
                        "name": "ollama cloud free",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "qwen3-coder:480b",
                                "actualModel": "qwen3-coder:480b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "nemotron-3-nano:30b",
                                "actualModel": "nemotron-3-nano:30b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "nemotron-3-super",
                                "actualModel": "nemotron-3-super",
                                "source": "direct"
                            },
                            {
                                "requestModel": "minimax-m2.5",
                                "actualModel": "minimax-m2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemma4:31b",
                                "actualModel": "gemma4:31b",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRiU"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6291",
                        "name": "mimo官方渠道",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5-tts",
                                "actualModel": "mimo-v2.5-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voiceclone",
                                "actualModel": "mimo-v2.5-tts-voiceclone",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voicedesign",
                                "actualModel": "mimo-v2.5-tts-voicedesign",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-tts",
                                "actualModel": "mimo-v2-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRiT"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6285",
                        "name": "免费，随便蹬，5.5",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-image-2",
                                "actualModel": "gpt-image-2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5-openai-compact",
                                "actualModel": "gpt-5.5-openai-compact",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRiN"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6283",
                        "name": "CodeAI",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex-spark",
                                "actualModel": "gpt-5.3-codex-spark",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-1",
                                "actualModel": "gpt-image-1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-1.5",
                                "actualModel": "gpt-image-1.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-2",
                                "actualModel": "gpt-image-2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRiL"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6282",
                        "name": "gpt-codex-plus1111",
                        "type": "codex",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [
                            "codex",
                            "team"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRiK"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6279",
                        "name": "dexterdai-cpa",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "codex-auto-review",
                                "actualModel": "codex-auto-review",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-2",
                                "actualModel": "gpt-image-2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRiH"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6269",
                        "name": "【0.1倍率】GPT号池｜20万Token仅0.003刀",
                        "type": "openai_responses",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "支持GPT-5.5 | 97%-99%缓存命中｜超低成本｜响应快",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.3-codex-spark",
                                "actualModel": "gpt-5.3-codex-spark",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRh9"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6268",
                        "name": "kimi for coding",
                        "type": "moonshot_coding",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "kimi-for-coding",
                                "actualModel": "kimi-for-coding",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRh8"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6265",
                        "name": "Minimax-Token Plan",
                        "type": "minimax_anthropic",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "MiniMax-M2.7-highspeed",
                                "actualModel": "MiniMax-M2.7-highspeed",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRh5"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6264",
                        "name": "flymux-gpt",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRh4"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6258",
                        "name": "国产模型glm",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "z-ai/glm-5.1",
                                "actualModel": "z-ai/glm-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "z-ai/glm4.7",
                                "actualModel": "z-ai/glm4.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "grok-4.20-fast",
                                "actualModel": "grok-4.20-fast",
                                "source": "direct"
                            },
                            {
                                "requestModel": "grok-image",
                                "actualModel": "grok-image",
                                "source": "direct"
                            },
                            {
                                "requestModel": "minimaxai/minimax-m2.7",
                                "actualModel": "minimaxai/minimax-m2.7",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRhy"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6255",
                        "name": "皆非-GLM5.1（0.01倍率）",
                        "type": "zhipu",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "glm-5.1",
                                "actualModel": "glm-5.1",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRhv"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6248",
                        "name": "Mimo-xiaomi",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRho"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6246",
                        "name": "baro-自用plus",
                        "type": "codex",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "自用的plus",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRhm"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6245",
                        "name": "48team号池-0.1倍率",
                        "type": "openai_responses",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [
                            "自用Codex Pro"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRhl"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6242",
                        "name": "ciallo",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "grok-4.20-auto",
                                "actualModel": "grok-4.20-auto",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5.1",
                                "actualModel": "glm-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.6-plus",
                                "actualModel": "qwen3.6-plus",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.6-plus-preview",
                                "actualModel": "qwen3.6-plus-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.7",
                                "actualModel": "MiniMax-M2.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "kimi-k2.6",
                                "actualModel": "kimi-k2.6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "grok-4.20-expert",
                                "actualModel": "grok-4.20-expert",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.6-max-preview",
                                "actualModel": "qwen3.6-max-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "kimi-k2.5",
                                "actualModel": "kimi-k2.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRhi"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6241",
                        "name": "小米700M",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRhh"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6238",
                        "name": "dreamyc-5.4(0.1倍率)",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRhe"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6235",
                        "name": "自用Team号池",
                        "type": "codex",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "codex-auto-review",
                                "actualModel": "codex-auto-review",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-2",
                                "actualModel": "gpt-image-2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRhb"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6233",
                        "name": "OpenAI-Team-一个号",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-4o-audio-preview",
                                "actualModel": "gpt-4o-audio-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2-2025-12-11",
                                "actualModel": "gpt-5.2-2025-12-11",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2-chat-latest",
                                "actualModel": "gpt-5.2-chat-latest",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2-pro-2025-12-11",
                                "actualModel": "gpt-5.2-pro-2025-12-11",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-4o-realtime-preview",
                                "actualModel": "gpt-4o-realtime-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex-spark",
                                "actualModel": "gpt-5.3-codex-spark",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-1",
                                "actualModel": "gpt-image-1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-1.5",
                                "actualModel": "gpt-image-1.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-2",
                                "actualModel": "gpt-image-2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2-pro",
                                "actualModel": "gpt-5.2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-2026-03-05",
                                "actualModel": "gpt-5.4-2026-03-05",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRhZ"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6223",
                        "name": "0.01x!支持随意检测!已优化网络完毕",
                        "type": "openai_responses",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [
                            "官方"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRhP"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6220",
                        "name": "Gemini-Pro-flash-0.2倍率",
                        "type": "gemini",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "随意蹬吧各位",
                        "allModelEntries": [
                            {
                                "requestModel": "gemini-3.1-pro-preview",
                                "actualModel": "gemini-3.1-pro-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-3-flash-preview",
                                "actualModel": "gemini-3-flash-preview",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRhM"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6218",
                        "name": "team+plus+pro号池",
                        "type": "codex",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [
                            "openai"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRhK"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6213",
                        "name": "[0.08X，plus池]ai403",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "自建plus号池，0.08倍率。人比较少，流畅使用。",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRhF"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6212",
                        "name": "百亿 plan",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts",
                                "actualModel": "mimo-v2.5-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voiceclone",
                                "actualModel": "mimo-v2.5-tts-voiceclone",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voicedesign",
                                "actualModel": "mimo-v2.5-tts-voicedesign",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-tts",
                                "actualModel": "mimo-v2-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRhE"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6206",
                        "name": "GPT5.4 0.1倍 闲置号池",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRg+"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6205",
                        "name": "GPT 5.5  0.1倍 闲置号池",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRg9"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6204",
                        "name": "grok-4.8k+account",
                        "type": "xai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "grok-4.20-0309-non-reasoning",
                                "actualModel": "grok-4.20-0309-non-reasoning",
                                "source": "direct"
                            },
                            {
                                "requestModel": "grok-4.20-fast",
                                "actualModel": "grok-4.20-fast",
                                "source": "direct"
                            },
                            {
                                "requestModel": "grok-imagine-image-lite",
                                "actualModel": "grok-imagine-image-lite",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRg8"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6201",
                        "name": "PAA",
                        "type": "anthropic",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "claude-haiku-4-5-20251001",
                                "actualModel": "claude-haiku-4-5-20251001",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-opus-4-6",
                                "actualModel": "claude-opus-4-6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-opus-4-7",
                                "actualModel": "claude-opus-4-7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-sonnet-4-6",
                                "actualModel": "claude-sonnet-4-6",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRg5"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6200",
                        "name": "Standard 月度套餐",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2-flash",
                                "actualModel": "mimo-v2-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voiceclone",
                                "actualModel": "mimo-v2.5-tts-voiceclone",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voicedesign",
                                "actualModel": "mimo-v2.5-tts-voicedesign",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-tts",
                                "actualModel": "mimo-v2-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts",
                                "actualModel": "mimo-v2.5-tts",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRg4"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6196",
                        "name": "MiniMax M2.7",
                        "type": "minimax_anthropic",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [
                            "MiniMax",
                            "minimax-m2.7",
                            "miniMax-M2.7"
                        ],
                        "remark": "有问题L站联系",
                        "allModelEntries": [
                            {
                                "requestModel": "MiniMax-M2.7",
                                "actualModel": "MiniMax-M2.7",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRg0"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6194",
                        "name": "minimax_jjfc",
                        "type": "minimax_anthropic",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "MiniMax-M2.7",
                                "actualModel": "MiniMax-M2.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.5",
                                "actualModel": "MiniMax-M2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.7-highspeed",
                                "actualModel": "MiniMax-M2.7-highspeed",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.5-highspeed",
                                "actualModel": "MiniMax-M2.5-highspeed",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRgy"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6192",
                        "name": "[0.2x]openai plus+free号池",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRgw"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6187",
                        "name": "grok-4.1",
                        "type": "xai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "grok-4.1-fast",
                                "actualModel": "grok-4.1-fast",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRgr"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6186",
                        "name": "myaf",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "qwen/qwen3.5-122b-a10b",
                                "actualModel": "qwen/qwen3.5-122b-a10b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen/qwen3.5-397b-a17b",
                                "actualModel": "qwen/qwen3.5-397b-a17b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-ai/deepseek-v4-flash",
                                "actualModel": "deepseek-ai/deepseek-v4-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-r1",
                                "actualModel": "deepseek-r1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5.1",
                                "actualModel": "glm-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-4.5-Air",
                                "actualModel": "GLM-4.5-Air",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-4.7",
                                "actualModel": "GLM-4.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen3.5-397b-a17b",
                                "actualModel": "qwen3.5-397b-a17b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-ai/deepseek-v4-pro",
                                "actualModel": "deepseek-ai/deepseek-v4-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-ai/DeepSeek-V3.2",
                                "actualModel": "deepseek-ai/DeepSeek-V3.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-4.5",
                                "actualModel": "GLM-4.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-4.6",
                                "actualModel": "GLM-4.6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "DeepSeek-V3.2",
                                "actualModel": "DeepSeek-V3.2",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRgq"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6170",
                        "name": "codex稳定渠道",
                        "type": "codex",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.4-2026-03-05",
                                "actualModel": "gpt-5.4-2026-03-05",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-1",
                                "actualModel": "gpt-image-1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2-2025-12-11",
                                "actualModel": "gpt-5.2-2025-12-11",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2-chat-latest",
                                "actualModel": "gpt-5.2-chat-latest",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2-pro-2025-12-11",
                                "actualModel": "gpt-5.2-pro-2025-12-11",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-1.5",
                                "actualModel": "gpt-image-1.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-4o-audio-preview",
                                "actualModel": "gpt-4o-audio-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-2",
                                "actualModel": "gpt-image-2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-4o-realtime-preview",
                                "actualModel": "gpt-4o-realtime-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2-pro",
                                "actualModel": "gpt-5.2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex-spark",
                                "actualModel": "gpt-5.3-codex-spark",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRga"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6169",
                        "name": "glm max",
                        "type": "zai_anthropic",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "glm-5",
                                "actualModel": "glm-5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5-turbo",
                                "actualModel": "glm-5-turbo",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5.1",
                                "actualModel": "glm-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4.5",
                                "actualModel": "glm-4.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4.5-air",
                                "actualModel": "glm-4.5-air",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4.6",
                                "actualModel": "glm-4.6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4.7",
                                "actualModel": "glm-4.7",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRgZ"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6168",
                        "name": "XiaoMi官方",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5-tts-voicedesign",
                                "actualModel": "mimo-v2.5-tts-voicedesign",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-tts",
                                "actualModel": "mimo-v2-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts",
                                "actualModel": "mimo-v2.5-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voiceclone",
                                "actualModel": "mimo-v2.5-tts-voiceclone",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRgY"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6163",
                        "name": "GLM 0.1",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "glm-5.1",
                                "actualModel": "glm-5.1",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRgT"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6150",
                        "name": "闲置号池",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.2-chat-latest",
                                "actualModel": "gpt-5.2-chat-latest",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2-pro",
                                "actualModel": "gpt-5.2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2-pro-2025-12-11",
                                "actualModel": "gpt-5.2-pro-2025-12-11",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-2026-03-05",
                                "actualModel": "gpt-5.4-2026-03-05",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex-spark",
                                "actualModel": "gpt-5.3-codex-spark",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-1",
                                "actualModel": "gpt-image-1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-1.5",
                                "actualModel": "gpt-image-1.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-4o-audio-preview",
                                "actualModel": "gpt-4o-audio-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-4o-realtime-preview",
                                "actualModel": "gpt-4o-realtime-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2-2025-12-11",
                                "actualModel": "gpt-5.2-2025-12-11",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-2",
                                "actualModel": "gpt-image-2",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRgG"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6143",
                        "name": "硅基流动官网(0.4倍率)",
                        "type": "siliconflow",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "deepseek-ai/DeepSeek-V4-Flash",
                                "actualModel": "deepseek-ai/DeepSeek-V4-Flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Pro/zai-org/GLM-5.1",
                                "actualModel": "Pro/zai-org/GLM-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Pro/moonshotai/Kimi-K2.6",
                                "actualModel": "Pro/moonshotai/Kimi-K2.6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Pro/deepseek-ai/DeepSeek-V3.2",
                                "actualModel": "Pro/deepseek-ai/DeepSeek-V3.2",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRf/"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6141",
                        "name": "蹬就完了，纯血百炼api，绝不掺假",
                        "type": "bailian",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "qwen3.6-max-preview",
                                "actualModel": "qwen3.6-max-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-pro",
                                "actualModel": "deepseek-v4-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5.1",
                                "actualModel": "glm-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "kimi-k2.6",
                                "actualModel": "kimi-k2.6",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRf9"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6140",
                        "name": "95-自用号池-Claude",
                        "type": "anthropic",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "deepseek-v4-pro",
                                "actualModel": "deepseek-v4-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-flash",
                                "actualModel": "deepseek-v4-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-haiku-4-5",
                                "actualModel": "claude-haiku-4-5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-haiku-4-5-20251001",
                                "actualModel": "claude-haiku-4-5-20251001",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-sonnet-4-5-20250929",
                                "actualModel": "claude-sonnet-4-5-20250929",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-sonnet-4-6",
                                "actualModel": "claude-sonnet-4-6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-sonnet-4-6-thinking",
                                "actualModel": "claude-sonnet-4-6-thinking",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRf8"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6138",
                        "name": "GPT-D",
                        "type": "openai_responses",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-3.1-pro-preview",
                                "actualModel": "gemini-3.1-pro-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "z-ai/glm-5.1",
                                "actualModel": "z-ai/glm-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRf6"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6133",
                        "name": "mimo-for-mine",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts",
                                "actualModel": "mimo-v2.5-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voiceclone",
                                "actualModel": "mimo-v2.5-tts-voiceclone",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voicedesign",
                                "actualModel": "mimo-v2.5-tts-voicedesign",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-tts",
                                "actualModel": "mimo-v2-tts",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRf1"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6127",
                        "name": "joverna",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "Deepseek-V4-Flash",
                                "actualModel": "Deepseek-V4-Flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Deepseek-V4-Pro",
                                "actualModel": "Deepseek-V4-Pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Kimi-K2.6",
                                "actualModel": "Kimi-K2.6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-5.1",
                                "actualModel": "GLM-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.7",
                                "actualModel": "MiniMax-M2.7",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRfv"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6126",
                        "name": "mimo官方coding plan 0.1x",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts",
                                "actualModel": "mimo-v2.5-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voiceclone",
                                "actualModel": "mimo-v2.5-tts-voiceclone",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voicedesign",
                                "actualModel": "mimo-v2.5-tts-voicedesign",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-tts",
                                "actualModel": "mimo-v2-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRfu"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6125",
                        "name": "laodog-gpt",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRft"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6122",
                        "name": "1工艺",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-pro",
                                "actualModel": "deepseek-v4-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-flash",
                                "actualModel": "deepseek-v4-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-sonnet-4-5",
                                "actualModel": "claude-sonnet-4-5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-sonnet-4-6",
                                "actualModel": "claude-sonnet-4-6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-opus-4-7",
                                "actualModel": "claude-opus-4-7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-opus-4-6",
                                "actualModel": "claude-opus-4-6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-pro",
                                "actualModel": "gpt-5.4-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-3.1-pro-preview",
                                "actualModel": "gemini-3.1-pro-preview",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRfq"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6121",
                        "name": "GLM官方coding plan lite 0.1x",
                        "type": "zhipu_anthropic",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "glm-4.5-air",
                                "actualModel": "glm-4.5-air",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4.6",
                                "actualModel": "glm-4.6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4.7",
                                "actualModel": "glm-4.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5",
                                "actualModel": "glm-5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5-turbo",
                                "actualModel": "glm-5-turbo",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5.1",
                                "actualModel": "glm-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4.5",
                                "actualModel": "glm-4.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRfp"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6119",
                        "name": "小米抄底（0.02倍）",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRfn"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6114",
                        "name": "蹬就完了（0.2倍）",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "deepseek-ai/deepseek-v4-pro",
                                "actualModel": "deepseek-ai/deepseek-v4-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-2.5-pro-search",
                                "actualModel": "gemini-2.5-pro-search",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-4.6-thinking",
                                "actualModel": "GLM-4.6-thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-4.7-deepsearch",
                                "actualModel": "GLM-4.7-deepsearch",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-4.7-search",
                                "actualModel": "GLM-4.7-search",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-5-thinking-search",
                                "actualModel": "GLM-5-thinking-search",
                                "source": "direct"
                            },
                            {
                                "requestModel": "grok-4.20-auto",
                                "actualModel": "grok-4.20-auto",
                                "source": "direct"
                            },
                            {
                                "requestModel": "z-ai/glm4.7",
                                "actualModel": "z-ai/glm4.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "z-ai/glm5",
                                "actualModel": "z-ai/glm5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-2.5-pro",
                                "actualModel": "gemini-2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-4.5-Air",
                                "actualModel": "GLM-4.5-Air",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-4.5-V",
                                "actualModel": "GLM-4.5-V",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-5-deepsearch",
                                "actualModel": "GLM-5-deepsearch",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-5-Turbo-thinking",
                                "actualModel": "GLM-5-Turbo-thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-5-Turbo-thinking-search",
                                "actualModel": "GLM-5-Turbo-thinking-search",
                                "source": "direct"
                            },
                            {
                                "requestModel": "grok-4.20-0309-non-reasoning",
                                "actualModel": "grok-4.20-0309-non-reasoning",
                                "source": "direct"
                            },
                            {
                                "requestModel": "grok-4.20-expert",
                                "actualModel": "grok-4.20-expert",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-3.1-pro-preview-search",
                                "actualModel": "gemini-3.1-pro-preview-search",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-4.5-thinking",
                                "actualModel": "GLM-4.5-thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-4.7",
                                "actualModel": "GLM-4.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-4.7-thinking-search",
                                "actualModel": "GLM-4.7-thinking-search",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-5-search",
                                "actualModel": "GLM-5-search",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-5-thinking",
                                "actualModel": "GLM-5-thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "grok-4.20-fast",
                                "actualModel": "grok-4.20-fast",
                                "source": "direct"
                            },
                            {
                                "requestModel": "minimaxai/minimax-m2.7",
                                "actualModel": "minimaxai/minimax-m2.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-3-pro-preview",
                                "actualModel": "gemini-3-pro-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-3.1-pro-preview",
                                "actualModel": "gemini-3.1-pro-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-4.6-V",
                                "actualModel": "GLM-4.6-V",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-4.7-deepsearch-thinking",
                                "actualModel": "GLM-4.7-deepsearch-thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-5",
                                "actualModel": "GLM-5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-5-Turbo",
                                "actualModel": "GLM-5-Turbo",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-5-Turbo-deepsearch",
                                "actualModel": "GLM-5-Turbo-deepsearch",
                                "source": "direct"
                            },
                            {
                                "requestModel": "grok-4.20-0309-reasoning",
                                "actualModel": "grok-4.20-0309-reasoning",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-5-deepsearch-thinking",
                                "actualModel": "GLM-5-deepsearch-thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "grok-imagine-image-lite",
                                "actualModel": "grok-imagine-image-lite",
                                "source": "direct"
                            },
                            {
                                "requestModel": "minimaxai/minimax-m2.5",
                                "actualModel": "minimaxai/minimax-m2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "openai/gpt-oss-120b",
                                "actualModel": "openai/gpt-oss-120b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "openai/gpt-oss-20b",
                                "actualModel": "openai/gpt-oss-20b",
                                "source": "direct"
                            },
                            {
                                "requestModel": "z-ai/glm-5.1",
                                "actualModel": "z-ai/glm-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-ai/deepseek-v4-flash",
                                "actualModel": "deepseek-ai/deepseek-v4-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-3-pro-preview-thinking",
                                "actualModel": "gemini-3-pro-preview-thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-4.5",
                                "actualModel": "GLM-4.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4.6",
                                "actualModel": "glm-4.6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-4.7-thinking",
                                "actualModel": "GLM-4.7-thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5.1-chat",
                                "actualModel": "glm-5.1-chat",
                                "source": "direct"
                            },
                            {
                                "requestModel": "google/gemma-4-31b-it",
                                "actualModel": "google/gemma-4-31b-it",
                                "source": "direct"
                            },
                            {
                                "requestModel": "grok-4.20-0309",
                                "actualModel": "grok-4.20-0309",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-3-pro-preview-search",
                                "actualModel": "gemini-3-pro-preview-search",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-4.6-V-thinking",
                                "actualModel": "GLM-4.6-V-thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-5-Turbo-deepsearch-thinking",
                                "actualModel": "GLM-5-Turbo-deepsearch-thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "GLM-5-Turbo-search",
                                "actualModel": "GLM-5-Turbo-search",
                                "source": "direct"
                            },
                            {
                                "requestModel": "moonshotai/kimi-k2.6",
                                "actualModel": "moonshotai/kimi-k2.6",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRfi"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6113",
                        "name": "Gemini 蹬就完了（0.2倍）",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "deepseek-v4-flash",
                                "actualModel": "deepseek-v4-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-pro",
                                "actualModel": "deepseek-v4-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-3.1-pro",
                                "actualModel": "gemini-3.1-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5",
                                "actualModel": "glm-5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-nano",
                                "actualModel": "gpt-5.4-nano",
                                "source": "direct"
                            },
                            {
                                "requestModel": "minimax-m2.5",
                                "actualModel": "minimax-m2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-haiku-4.5",
                                "actualModel": "claude-haiku-4.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-3-flash",
                                "actualModel": "gemini-3-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "kimi-k2.5",
                                "actualModel": "kimi-k2.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRfh"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6112",
                        "name": "无问芯穹-Max套餐-有并发限制-OpenAI Completion",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "glm-5.1",
                                "actualModel": "glm-5.1",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRfg"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6104",
                        "name": "lll9p",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRfY"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6103",
                        "name": "高可用-DeepSeek-V4-一折",
                        "type": "deepseek",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "deepseek-v4-pro",
                                "actualModel": "deepseek-v4-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-flash",
                                "actualModel": "deepseek-v4-flash",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRfX"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6102",
                        "name": "官方订阅中转",
                        "type": "anthropic",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "claude-haiku-4-5-20251001",
                                "actualModel": "claude-haiku-4-5-20251001",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-opus-4-7",
                                "actualModel": "claude-opus-4-7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-sonnet-4-6",
                                "actualModel": "claude-sonnet-4-6",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRfW"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6100",
                        "name": "hais-minimax",
                        "type": "minimax",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "MiniMax-M2.7",
                                "actualModel": "MiniMax-M2.7",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRfU"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6095",
                        "name": "mimo plan 0.01x",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-tts",
                                "actualModel": "mimo-v2-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRfP"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6094",
                        "name": "Xiaomi MiMo Premium",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [
                            "mimo",
                            "mimo-v2.5-pro",
                            "pro",
                            "xiaomimimo",
                            "xiaomi",
                            "mimo-v2-pro",
                            "mimo-v2-flash"
                        ],
                        "remark": "小米官方高速稳定节点，非 Plan 包月套餐。",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-flash",
                                "actualModel": "mimo-v2-flash",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRfO"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6093",
                        "name": "小米plan 0.1x",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5-tts",
                                "actualModel": "mimo-v2.5-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voiceclone",
                                "actualModel": "mimo-v2.5-tts-voiceclone",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voicedesign",
                                "actualModel": "mimo-v2.5-tts-voicedesign",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-tts",
                                "actualModel": "mimo-v2-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRfN"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6092",
                        "name": "国产模型 0.1x",
                        "type": "volcengine",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "glm-5.1",
                                "actualModel": "glm-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "kimi-k2.6",
                                "actualModel": "kimi-k2.6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "minimax-m2.7",
                                "actualModel": "minimax-m2.7",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRfM"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6085",
                        "name": "earun-gpt-plus（0.03倍率）",
                        "type": "codex",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "pp搓太多了用不完，放了10个plus",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRfF"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6083",
                        "name": "[DF] 0.3x  付費中轉。plus+pro",
                        "type": "openai_responses",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "我也在用。plus+pro.\n不可破限。\n",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRfD"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6079",
                        "name": "DeepSeek 0.1倍率 CodingPlan 开蹬！",
                        "type": "deepseek",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [
                            "官方",
                            "deepseek"
                        ],
                        "remark": "同事送的 用不上给佬友们蹬了",
                        "allModelEntries": [
                            {
                                "requestModel": "deepseek-v4-flash",
                                "actualModel": "DeepSeek-V4-Flash",
                                "source": "mapping"
                            },
                            {
                                "requestModel": "deepseek-v4-pro",
                                "actualModel": "DeepSeek-V4-Pro",
                                "source": "mapping"
                            }
                        ]
                    },
                    "cursor": "gaFpzRe/"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6074",
                        "name": "官方纯血版plus号池",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRe6"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6073",
                        "name": "gemini",
                        "type": "gemini",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gemini-3-flash-preview",
                                "actualModel": "gemini-3-flash-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-3.1-pro-preview",
                                "actualModel": "gemini-3.1-pro-preview",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRe5"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6068",
                        "name": "小米 MIMO(超低倍率)",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5-tts-voiceclone",
                                "actualModel": "mimo-v2.5-tts-voiceclone",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voicedesign",
                                "actualModel": "mimo-v2.5-tts-voicedesign",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-tts",
                                "actualModel": "mimo-v2-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts",
                                "actualModel": "mimo-v2.5-tts",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRe0"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6066",
                        "name": "仙仙api",
                        "type": "gemini",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "这是按次的，无论用多少都是这个价，主要就是快点，能换点就换点，感谢您的调用",
                        "allModelEntries": [
                            {
                                "requestModel": "[次]gemini-2.5-pro-thinking",
                                "actualModel": "[次]gemini-2.5-pro-thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "[次]gemini-3-flash-preview",
                                "actualModel": "[次]gemini-3-flash-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "[次]gemini-3-pro-preview",
                                "actualModel": "[次]gemini-3-pro-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "[次]gemini-3-pro-preview-thinking",
                                "actualModel": "[次]gemini-3-pro-preview-thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "[次]gemini-3.1-pro-preview",
                                "actualModel": "[次]gemini-3.1-pro-preview",
                                "source": "direct"
                            },
                            {
                                "requestModel": "[次]gemini-3.1-pro-preview-thinking",
                                "actualModel": "[次]gemini-3.1-pro-preview-thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "[次]gemini-3.5-flash",
                                "actualModel": "[次]gemini-3.5-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "[次]gemini-2.5-pro",
                                "actualModel": "[次]gemini-2.5-pro",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRey"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6065",
                        "name": "zwz211123-DeepSeek",
                        "type": "deepseek",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "deepseek-chat",
                                "actualModel": "deepseek-chat",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-reasoner",
                                "actualModel": "deepseek-reasoner",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRex"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6064",
                        "name": "0.05x claude gpt转 高可用",
                        "type": "anthropic",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "大方 极品 展示 gpt模型转cc 0.05倍率(注意是小数点后两位)+缓存命中超高 plus号池",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.4(xhigh)",
                                "actualModel": "gpt-5.4(xhigh)",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5(xhigh)",
                                "actualModel": "gpt-5.5(xhigh)",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRew"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6057",
                        "name": "小米max套餐",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5-tts",
                                "actualModel": "mimo-v2.5-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voiceclone",
                                "actualModel": "mimo-v2.5-tts-voiceclone",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voicedesign",
                                "actualModel": "mimo-v2.5-tts-voicedesign",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-tts",
                                "actualModel": "mimo-v2-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRep"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6054",
                        "name": "minmax",
                        "type": "minimax",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "MiniMax-M2.7",
                                "actualModel": "MiniMax-M2.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.5",
                                "actualModel": "MiniMax-M2.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRem"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6053",
                        "name": "zai_sccens",
                        "type": "zai_anthropic",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "glm-4.5-air",
                                "actualModel": "glm-4.5-air",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4.6",
                                "actualModel": "glm-4.6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4.7",
                                "actualModel": "glm-4.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5",
                                "actualModel": "glm-5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5-turbo",
                                "actualModel": "glm-5-turbo",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5.1",
                                "actualModel": "glm-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4.5",
                                "actualModel": "glm-4.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRel"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6051",
                        "name": "kimi-coding",
                        "type": "moonshot_coding",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "kimi-for-coding",
                                "actualModel": "kimi-for-coding",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRej"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6049",
                        "name": "api2api",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-pro",
                                "actualModel": "gpt-5.4-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-3-flash",
                                "actualModel": "gemini-3-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-3.1-pro",
                                "actualModel": "gemini-3.1-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "Kimi-K2.6",
                                "actualModel": "Kimi-K2.6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.7",
                                "actualModel": "MiniMax-M2.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-flash",
                                "actualModel": "deepseek-v4-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-pro",
                                "actualModel": "deepseek-v4-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.7-highspeed",
                                "actualModel": "MiniMax-M2.7-highspeed",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5.1",
                                "actualModel": "glm-5.1",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzReh"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6045",
                        "name": "minimax-1",
                        "type": "minimax_anthropic",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "MiniMax-M2.1",
                                "actualModel": "MiniMax-M2.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.1-highspeed",
                                "actualModel": "MiniMax-M2.1-highspeed",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2",
                                "actualModel": "MiniMax-M2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.7",
                                "actualModel": "MiniMax-M2.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.7-highspeed",
                                "actualModel": "MiniMax-M2.7-highspeed",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.5",
                                "actualModel": "MiniMax-M2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.5-highspeed",
                                "actualModel": "MiniMax-M2.5-highspeed",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRed"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6022",
                        "name": "老狗",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzReG"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6021",
                        "name": "FatNew-Kimi",
                        "type": "moonshot_coding",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "kimi-k2.6",
                                "actualModel": "kimi-k2.6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "kimi-for-coding",
                                "actualModel": "kimi-for-coding",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzReF"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6020",
                        "name": "自购官方",
                        "type": "deepseek",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "deepseek-v4-flash",
                                "actualModel": "deepseek-v4-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-pro",
                                "actualModel": "deepseek-v4-pro",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzReE"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6019",
                        "name": "https://api.fireworks.ai/inference",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "kimi-2.6",
                                "actualModel": "accounts/fireworks/models/kimi-k2p6",
                                "source": "mapping"
                            },
                            {
                                "requestModel": "models/glm-5p1",
                                "actualModel": "accounts/fireworks/models/glm-5p1",
                                "source": "auto_trim"
                            },
                            {
                                "requestModel": "models/kimi-k2p6",
                                "actualModel": "accounts/fireworks/models/kimi-k2p6",
                                "source": "auto_trim"
                            },
                            {
                                "requestModel": "models/deepseek-v4-pro",
                                "actualModel": "accounts/fireworks/models/deepseek-v4-pro",
                                "source": "auto_trim"
                            },
                            {
                                "requestModel": "kimi-k2p6",
                                "actualModel": "accounts/fireworks/models/kimi-k2p6",
                                "source": "auto_trim"
                            },
                            {
                                "requestModel": "deepseek-v4-pro",
                                "actualModel": "accounts/fireworks/models/deepseek-v4-pro",
                                "source": "auto_trim"
                            },
                            {
                                "requestModel": "minimax-2.7",
                                "actualModel": "accounts/fireworks/models/minimax-m2p7",
                                "source": "mapping"
                            },
                            {
                                "requestModel": "minimax-m2p7",
                                "actualModel": "accounts/fireworks/models/minimax-m2p7",
                                "source": "auto_trim"
                            },
                            {
                                "requestModel": "glm-5.1",
                                "actualModel": "accounts/fireworks/models/glm-5p1",
                                "source": "mapping"
                            },
                            {
                                "requestModel": "fireworks/models/deepseek-v4-pro",
                                "actualModel": "accounts/fireworks/models/deepseek-v4-pro",
                                "source": "auto_trim"
                            },
                            {
                                "requestModel": "glm-5p1",
                                "actualModel": "accounts/fireworks/models/glm-5p1",
                                "source": "auto_trim"
                            },
                            {
                                "requestModel": "fireworks/models/minimax-m2p7",
                                "actualModel": "accounts/fireworks/models/minimax-m2p7",
                                "source": "auto_trim"
                            },
                            {
                                "requestModel": "fireworks/models/glm-5p1",
                                "actualModel": "accounts/fireworks/models/glm-5p1",
                                "source": "auto_trim"
                            },
                            {
                                "requestModel": "fireworks/models/kimi-k2p6",
                                "actualModel": "accounts/fireworks/models/kimi-k2p6",
                                "source": "auto_trim"
                            },
                            {
                                "requestModel": "models/minimax-m2p7",
                                "actualModel": "accounts/fireworks/models/minimax-m2p7",
                                "source": "auto_trim"
                            }
                        ]
                    },
                    "cursor": "gaFpzReD"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6015",
                        "name": "13",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "z-ai/glm-5.1",
                                "actualModel": "z-ai/glm-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "moonshotai/kimi-k2.6",
                                "actualModel": "moonshotai/kimi-k2.6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek/deepseek-v4-flash",
                                "actualModel": "deepseek/deepseek-v4-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek/deepseek-v4-pro",
                                "actualModel": "deepseek/deepseek-v4-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "qwen/qwen3.6-plus",
                                "actualModel": "qwen/qwen3.6-plus",
                                "source": "direct"
                            },
                            {
                                "requestModel": "minimax/minimax-m2.7",
                                "actualModel": "minimax/minimax-m2.7",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRd/"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6014",
                        "name": "SunRouter-gemini",
                        "type": "gemini_openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gemini-3.1-pro",
                                "actualModel": "gemini-3.1-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gemini-3-flash",
                                "actualModel": "gemini-3-flash",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRd+"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/6012",
                        "name": "坤坤",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "0.15倍率出闲置 自用官方 coding plan",
                        "allModelEntries": [
                            {
                                "requestModel": "kimi-k2.6",
                                "actualModel": "kimi-k2.6",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5.1",
                                "actualModel": "glm-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-image-2",
                                "actualModel": "gpt-image-2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRd8"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5992",
                        "name": "lutes(plus,team)号池",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRdo"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5991",
                        "name": "小米mimo max 使劲蹬",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRdn"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5985",
                        "name": "elysiver-deepseek",
                        "type": "deepseek",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "deepseek-v4-flash",
                                "actualModel": "deepseek-v4-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-flash-2cc",
                                "actualModel": "deepseek-v4-flash-2cc",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-pro-2cc",
                                "actualModel": "deepseek-v4-pro-2cc",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v4-pro",
                                "actualModel": "deepseek-v4-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v3.2-2cc",
                                "actualModel": "deepseek-v3.2-2cc",
                                "source": "direct"
                            },
                            {
                                "requestModel": "deepseek-v3.2",
                                "actualModel": "deepseek-v3.2",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRdh"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5971",
                        "name": "纯情女大",
                        "type": "openai_responses",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRdT"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5970",
                        "name": "xxxx",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRdS"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5968",
                        "name": "楚辞",
                        "type": "siliconflow",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "deepseek-ai/DeepSeek-V3.2",
                                "actualModel": "deepseek-ai/DeepSeek-V3.2",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRdQ"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5966",
                        "name": "小米MIMO_API",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "小米MIMO官方API模型，个人账户闲置，共7亿额度",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts",
                                "actualModel": "mimo-v2.5-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voiceclone",
                                "actualModel": "mimo-v2.5-tts-voiceclone",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-tts-voicedesign",
                                "actualModel": "mimo-v2.5-tts-voicedesign",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-tts",
                                "actualModel": "mimo-v2-tts",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRdO"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5965",
                        "name": "yf",
                        "type": "minimax",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "MiniMax-M2.7",
                                "actualModel": "MiniMax-M2.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.5",
                                "actualModel": "MiniMax-M2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.1",
                                "actualModel": "MiniMax-M2.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2",
                                "actualModel": "MiniMax-M2",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRdN"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5959",
                        "name": "modelscope",
                        "type": "modelscope",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "free",
                        "allModelEntries": [
                            {
                                "requestModel": "deepseek-ai/DeepSeek-V4-Flash",
                                "actualModel": "deepseek-ai/DeepSeek-V4-Flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "ZhipuAI/GLM-5",
                                "actualModel": "ZhipuAI/GLM-5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRdH"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5956",
                        "name": "自用渠道AAAAA",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [
                            "国产模型"
                        ],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "glm-4.7",
                                "actualModel": "glm-4.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4.6v",
                                "actualModel": "glm-4.6v",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5",
                                "actualModel": "glm-5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5-turbo",
                                "actualModel": "glm-5-turbo",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5.1",
                                "actualModel": "glm-5.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4-flash",
                                "actualModel": "glm-4-flash",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5v-turbo",
                                "actualModel": "glm-5v-turbo",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-4-air-250414",
                                "actualModel": "glm-4-air-250414",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRdE"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5920",
                        "name": "Pro 5x （0.3倍率）",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "正价开的自用GPT Pro，稳得一批，禁止破限",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex-spark",
                                "actualModel": "gpt-5.3-codex-spark",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRcg"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5917",
                        "name": "free-token-plan",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRcd"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5916",
                        "name": "随便用ds\u0026mimo",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "111",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRcc"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5908",
                        "name": "longcat001",
                        "type": "longcat_anthropic",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "LongCat-Flash-Chat",
                                "actualModel": "LongCat-Flash-Chat",
                                "source": "direct"
                            },
                            {
                                "requestModel": "LongCat-Flash-Thinking",
                                "actualModel": "LongCat-Flash-Thinking",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRcU"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5893",
                        "name": "青韵api",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.3-codex-spark",
                                "actualModel": "gpt-5.3-codex-spark",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4-mini",
                                "actualModel": "gpt-5.4-mini",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.2",
                                "actualModel": "gpt-5.2",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.3-codex",
                                "actualModel": "gpt-5.3-codex",
                                "source": "direct"
                            },
                            {
                                "requestModel": "gpt-5.4",
                                "actualModel": "gpt-5.4",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRcF"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5891",
                        "name": "0.3倍率",
                        "type": "minimax",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "MiniMax-M2.7",
                                "actualModel": "MiniMax-M2.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.5",
                                "actualModel": "MiniMax-M2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.1",
                                "actualModel": "MiniMax-M2.1",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2",
                                "actualModel": "MiniMax-M2",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRcD"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5871",
                        "name": "xiaomimimo-noah",
                        "type": "xiaomi",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "mimo-v2-pro",
                                "actualModel": "mimo-v2-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-tts",
                                "actualModel": "mimo-v2-tts",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5",
                                "actualModel": "mimo-v2.5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2.5-pro",
                                "actualModel": "mimo-v2.5-pro",
                                "source": "direct"
                            },
                            {
                                "requestModel": "mimo-v2-omni",
                                "actualModel": "mimo-v2-omni",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRbv"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5859",
                        "name": "codex-free",
                        "type": "openai",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "free号",
                        "allModelEntries": [
                            {
                                "requestModel": "gpt-5.5",
                                "actualModel": "gpt-5.5",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRbj"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5857",
                        "name": "YJK",
                        "type": "moonshot",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "kimi-k2.6",
                                "actualModel": "kimi-k2.6",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRbh"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5835",
                        "name": "AAA",
                        "type": "volcengine",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "deepseek-chat",
                                "actualModel": "deepseek-chat",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRbL"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5833",
                        "name": "LongCat-2.0-Preview",
                        "type": "longcat",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "LongCat-2.0-Preview",
                                "actualModel": "LongCat-2.0-Preview",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRbJ"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5828",
                        "name": "longcat-winter",
                        "type": "longcat",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "LongCat-Flash-Thinking-2601",
                                "actualModel": "LongCat-Flash-Thinking-2601",
                                "source": "direct"
                            },
                            {
                                "requestModel": "LongCat-Flash-Chat",
                                "actualModel": "LongCat-Flash-Chat",
                                "source": "direct"
                            },
                            {
                                "requestModel": "LongCat-Flash-Omni-2603",
                                "actualModel": "LongCat-Flash-Omni-2603",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRbE"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5820",
                        "name": "Minimax 2.7拼车",
                        "type": "minimax",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "此即拼车渠道，为保障他人利益，不得滥用，3天后到期",
                        "allModelEntries": [
                            {
                                "requestModel": "MiniMax-M2.7",
                                "actualModel": "MiniMax-M2.7",
                                "source": "direct"
                            },
                            {
                                "requestModel": "MiniMax-M2.7-highspeed",
                                "actualModel": "MiniMax-M2.7-highspeed",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRa8"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5813",
                        "name": "YJ",
                        "type": "zai_anthropic",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "",
                        "allModelEntries": [
                            {
                                "requestModel": "glm-5",
                                "actualModel": "glm-5",
                                "source": "direct"
                            },
                            {
                                "requestModel": "glm-5.1",
                                "actualModel": "glm-5.1",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRa1"
                },
                {
                    "node": {
                        "id": "gid://axonhub/Channel/5812",
                        "name": "claude 4.5",
                        "type": "claudecode",
                        "status": "enabled",
                        "orderingWeight": 0,
                        "tags": [],
                        "remark": "只允许一个并发，建议晚上一个人用，官方",
                        "allModelEntries": [
                            {
                                "requestModel": "claude-opus-4-6 (1M)",
                                "actualModel": "claude-opus-4-6 (1M)",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-opus-4-6-thinking",
                                "actualModel": "claude-opus-4-6-thinking",
                                "source": "direct"
                            },
                            {
                                "requestModel": "claude-opus-4-6",
                                "actualModel": "claude-opus-4-6",
                                "source": "direct"
                            }
                        ]
                    },
                    "cursor": "gaFpzRa0"
                }
            ],
            "pageInfo": {
                "hasNextPage": true,
                "endCursor": "gaFpzRa0"
            },
            "totalCount": 1722
        }
    }
}