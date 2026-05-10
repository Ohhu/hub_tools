fetch("https://hub.linux.do/admin/graphql", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "authorization": "",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"148\", \"Google Chrome\";v=\"148\", \"Not/A)Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "x-project-id": "gid://axonhub/Project/1",
    "cookie": "",
    "Referer": "https://hub.linux.do/project/api-keys"
  },
  "body": "{\"query\":\"\\n    mutation UpdateAPIKey($id: ID!, $input: UpdateAPIKeyInput!) {\\n      updateAPIKey(id: $id, input: $input) {\\n        id\\n        createdAt\\n        updatedAt\\n      user {\\n        id\\n        firstName\\n        lastName\\n        email\\n        avatar\\n        linuxdoUserID\\n        linuxdoUsername\\n        linuxdoProfile {\\n          id\\n          username\\n          name\\n          avatarTemplate\\n          avatarUrl\\n          active\\n          trustLevel\\n          silenced\\n          externalIds\\n          updatedAt\\n        }\\n      }\\n        key\\n        name\\n        type\\n        status\\n        scopes\\n      }\\n    }\\n  \",\"variables\":{\"id\":\"gid://axonhub/APIKey/21512\",\"input\":{\"name\":\"测试7\"}},\"operationName\":\"UpdateAPIKey\"}",
  "method": "POST"
});

{
    "data": {
        "updateAPIKey": {
            "id": "gid://axonhub/APIKey/21512",
            "createdAt": "2026-05-09T07:28:18.575783Z",
            "updatedAt": "2026-05-10T07:17:43.518383Z",
            "user": {
                "id": "gid://axonhub/User/570",
                "firstName": "Merit",
                "lastName": "",
                "email": "1oap8qifegonqkgqs58jarf7083qvqeel4fkr0dub2rplh23ky@privaterelay.linux.do",
                "avatar": "https://cdn.ldstatic.com/user_avatar/linux.do/vsiu/288/538125_2.png",
                "linuxdoUserID": "29811",
                "linuxdoUsername": "vsiu",
                "linuxdoProfile": {
                    "id": "29811",
                    "username": "vsiu",
                    "name": "Merit",
                    "avatarTemplate": "https://cdn.ldstatic.com/user_avatar/linux.do/vsiu/288/538125_2.png",
                    "avatarUrl": "https://cdn.ldstatic.com/user_avatar/linux.do/vsiu/288/538125_2.png",
                    "active": true,
                    "trustLevel": 3,
                    "silenced": false,
                    "externalIds": null,
                    "updatedAt": "2026-05-08T14:05:56.034197404Z"
                }
            },
            "key": "ah-b29363c07e86074a26e40d1ceff23513dbce416ffcc4122dd3544ccb8a9f958c",
            "name": "测试7",
            "type": "user",
            "status": "enabled",
            "scopes": [
                "read_channels",
                "write_requests"
            ]
        }
    }
}