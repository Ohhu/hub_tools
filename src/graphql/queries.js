const queries = {
  createKey: "mutation CreateAPIKey($input:CreateAPIKeyInput!){createAPIKey(input:$input){id key name status type}}",
  getKeys: "query GetApiKeys($first:Int,$after:Cursor,$orderBy:APIKeyOrder,$where:APIKeyWhereInput){apiKeys(first:$first,after:$after,orderBy:$orderBy,where:$where){edges{node{id name}cursor}pageInfo{hasNextPage endCursor}totalCount}}",
  getKey: "query GetApiKey($id:ID!){node(id:$id){... on APIKey{id name status profiles{activeProfile profiles{name modelMappings{from to} channelIDs channelTags channelTagsMatchMode modelIDs loadBalanceStrategy channelBindingMode dynamicChannelStrategy{mode maxChannels minChannels maxPriceMultiplier maxLatencyMs minSuccessRate onlyOfficial includeTags excludeTags excludeChannelIDs fallbackChannelIDs} quota{requests totalTokens cost period{type pastDuration{value unit} calendarDuration{unit}}}}}}}}",
  getKeyValue: "query GetApiKeyValue($id:ID!){node(id:$id){... on APIKey{id key}}}",
  getChannelName: "query GetChannelName($id:ID!){node(id:$id){... on Channel{id name}}}",
  getChannelModelPrices: "query ChannelModelPrices($id:ID!){node(id:$id){... on Channel{id channelModelPrices{id modelID price{items{itemCode multiplier pricing{mode flatFee usagePerUnit usageTiered{tiers{upTo pricePerUnit}}} promptWriteCacheVariants{variantCode pricing{mode flatFee usagePerUnit}}}}}}}}",
  updateProfiles: "mutation UpdateAPIKeyProfiles($id:ID!,$input:UpdateAPIKeyProfilesInput!){updateAPIKeyProfiles(id:$id,input:$input){id name status profiles{activeProfile profiles{name channelIDs channelBindingMode}}}}",
  me: "query Me{me{id projects{projectID}}}",
};

