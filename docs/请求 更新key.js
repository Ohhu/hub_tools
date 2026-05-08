fetch("https://hub.linux.do/admin/graphql", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "authorization": "Bearer none",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"147\", \"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"147\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "x-project-id": "gid://axonhub/Project/1",
    "cookie": "none",
    "Referer": "https://hub.linux.do/project/api-keys"
  },
  "body": "{\"query\":\"\\n    mutation UpdateAPIKey($id: ID!, $input: UpdateAPIKeyInput!) {\\n      updateAPIKey(id: $id, input: $input) {\\n        id\\n        createdAt\\n        updatedAt\\n      user {\\n        id\\n        firstName\\n        lastName\\n      }\\n        key\\n        name\\n        type\\n        status\\n        scopes\\n\\n      }\\n    }\\n  \",\"variables\":{\"id\":\"gid://axonhub/APIKey/20555\",\"input\":{\"name\":\"wong 0.05x\"}},\"operationName\":\"UpdateAPIKey\"}",
  "method": "POST"
}); ;
fetch("https://hub.linux.do/admin/graphql", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "authorization": "Bearer none",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"147\", \"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"147\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "x-project-id": "gid://axonhub/Project/1",
    "cookie": "none",
    "Referer": "https://hub.linux.do/project/api-keys"
  },
  "body": "{\"query\":\"\\n    query GetApiKeys($first: Int, $after: Cursor, $orderBy: APIKeyOrder, $where: APIKeyWhereInput) {\\n      apiKeys(first: $first, after: $after, orderBy: $orderBy, where: $where) {\\n        edges {\\n          node {\\n            id\\n            createdAt\\n            updatedAt\\n          user {\\n            id\\n            firstName\\n            lastName\\n          }\\n            key\\n            name\\n            type\\n            status\\n            scopes\\n\\n          }\\n          cursor\\n        }\\n        pageInfo {\\n          hasNextPage\\n          hasPreviousPage\\n          startCursor\\n          endCursor\\n        }\\n        totalCount\\n      }\\n    }\\n  \",\"variables\":{\"first\":20,\"where\":{\"statusIn\":[\"enabled\",\"disabled\"],\"userID\":\"gid://axonhub/User/570\",\"typeNotIn\":[\"noauth\"]},\"orderBy\":{\"field\":\"CREATED_AT\",\"direction\":\"DESC\"}},\"operationName\":\"GetApiKeys\"}",
  "method": "POST"
}); ;
fetch("https://hub.linux.do/admin/graphql", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "authorization": "Bearer none",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"147\", \"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"147\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "x-project-id": "gid://axonhub/Project/1",
    "cookie": "none",
    "Referer": "https://hub.linux.do/project/api-keys"
  },
  "body": "{\"query\":\"\\n    query GetApiKey($id: ID!) {\\n      node(id: $id) {\\n        ... on APIKey {\\n        id\\n        createdAt\\n        updatedAt\\n      user {\\n        id\\n        firstName\\n        lastName\\n      }\\n        key\\n        name\\n        type\\n        status\\n        scopes\\n\\n        profiles {\\n          activeProfile\\n          profiles {\\n            name\\n            modelMappings { from to }\\n            channelIDs\\n            channelTags\\n            channelTagsMatchMode\\n            modelIDs\\n            loadBalanceStrategy\\n            channelBindingMode\\n            dynamicChannelStrategy {\\n              mode\\n              maxChannels\\n              minChannels\\n              maxPriceMultiplier\\n              maxLatencyMs\\n              minSuccessRate\\n              onlyOfficial\\n              includeTags\\n              excludeTags\\n              excludeChannelIDs\\n              fallbackChannelIDs\\n            }\\n            quota {\\n              requests\\n              totalTokens\\n              cost\\n              period {\\n                type\\n                pastDuration { value unit }\\n                calendarDuration { unit }\\n              }\\n            }\\n          }\\n        }\\n      }\\n    }\\n}\\n  \",\"variables\":{\"id\":\"gid://axonhub/APIKey/20555\"},\"operationName\":\"GetApiKey\"}",
  "method": "POST"
}); ;
fetch("https://hub.linux.do/admin/graphql", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "authorization": "Bearer none",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"147\", \"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"147\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "x-project-id": "gid://axonhub/Project/1",
    "cookie": "none",
    "Referer": "https://hub.linux.do/project/api-keys"
  },
  "body": "{\"query\":\"\\n  mutation UpdateAPIKeyProfiles($id: ID!, $input: UpdateAPIKeyProfilesInput!) {\\n    updateAPIKeyProfiles(id: $id, input: $input) {\\n      id\\n      name\\n      status\\n      profiles {\\n        activeProfile\\n        profiles {\\n          name\\n          modelMappings {\\n            from\\n            to\\n          }\\n          channelIDs\\n          channelTags\\n          channelTagsMatchMode\\n          modelIDs\\n          loadBalanceStrategy\\n          channelBindingMode\\n          dynamicChannelStrategy {\\n            mode\\n            maxChannels\\n            minChannels\\n            maxPriceMultiplier\\n            maxLatencyMs\\n            minSuccessRate\\n            onlyOfficial\\n            includeTags\\n            excludeTags\\n            excludeChannelIDs\\n            fallbackChannelIDs\\n          }\\n          quota {\\n            requests\\n            totalTokens\\n            cost\\n            period {\\n              type\\n              pastDuration { value unit }\\n              calendarDuration { unit }\\n            }\\n          }\\n        }\\n      }\\n    }\\n  }\\n\",\"variables\":{\"id\":\"gid://axonhub/APIKey/20555\",\"input\":{\"activeProfile\":\"default\",\"profiles\":[{\"name\":\"default\",\"modelMappings\":[],\"channelIDs\":[5638],\"channelTags\":[],\"channelTagsMatchMode\":\"any\",\"modelIDs\":[],\"loadBalanceStrategy\":null,\"channelBindingMode\":\"manual\",\"dynamicChannelStrategy\":null,\"quota\":null}]}},\"operationName\":\"UpdateAPIKeyProfiles\"}",
  "method": "POST"
}); ;
fetch("https://hub.linux.do/admin/graphql", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "authorization": "Bearer none",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"147\", \"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"147\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "x-project-id": "gid://axonhub/Project/1",
    "cookie": "none",
    "Referer": "https://hub.linux.do/project/api-keys"
  },
  "body": "{\"query\":\"\\n    query GetApiKeys($first: Int, $after: Cursor, $orderBy: APIKeyOrder, $where: APIKeyWhereInput) {\\n      apiKeys(first: $first, after: $after, orderBy: $orderBy, where: $where) {\\n        edges {\\n          node {\\n            id\\n            createdAt\\n            updatedAt\\n          user {\\n            id\\n            firstName\\n            lastName\\n          }\\n            key\\n            name\\n            type\\n            status\\n            scopes\\n\\n          }\\n          cursor\\n        }\\n        pageInfo {\\n          hasNextPage\\n          hasPreviousPage\\n          startCursor\\n          endCursor\\n        }\\n        totalCount\\n      }\\n    }\\n  \",\"variables\":{\"first\":20,\"where\":{\"statusIn\":[\"enabled\",\"disabled\"],\"userID\":\"gid://axonhub/User/570\",\"typeNotIn\":[\"noauth\"]},\"orderBy\":{\"field\":\"CREATED_AT\",\"direction\":\"DESC\"}},\"operationName\":\"GetApiKeys\"}",
  "method": "POST"
}); ;
fetch("https://hub.linux.do/admin/graphql", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "authorization": "Bearer none",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"147\", \"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"147\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "x-project-id": "gid://axonhub/Project/1",
    "cookie": "none",
    "Referer": "https://hub.linux.do/project/api-keys"
  },
  "body": "{\"query\":\"\\n    query GetApiKey($id: ID!) {\\n      node(id: $id) {\\n        ... on APIKey {\\n        id\\n        createdAt\\n        updatedAt\\n      user {\\n        id\\n        firstName\\n        lastName\\n      }\\n        key\\n        name\\n        type\\n        status\\n        scopes\\n\\n        profiles {\\n          activeProfile\\n          profiles {\\n            name\\n            modelMappings { from to }\\n            channelIDs\\n            channelTags\\n            channelTagsMatchMode\\n            modelIDs\\n            loadBalanceStrategy\\n            channelBindingMode\\n            dynamicChannelStrategy {\\n              mode\\n              maxChannels\\n              minChannels\\n              maxPriceMultiplier\\n              maxLatencyMs\\n              minSuccessRate\\n              onlyOfficial\\n              includeTags\\n              excludeTags\\n              excludeChannelIDs\\n              fallbackChannelIDs\\n            }\\n            quota {\\n              requests\\n              totalTokens\\n              cost\\n              period {\\n                type\\n                pastDuration { value unit }\\n                calendarDuration { unit }\\n              }\\n            }\\n          }\\n        }\\n      }\\n    }\\n}\\n  \",\"variables\":{\"id\":\"gid://axonhub/APIKey/20555\"},\"operationName\":\"GetApiKey\"}",
  "method": "POST"
});