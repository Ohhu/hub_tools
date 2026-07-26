function buildProfilesInput(profilesPayload, channelID, mode = "replace") {
  const targetIDs = mode === "append"
    ? uniqueChannelIDs([...currentProfileChannelIDs(profilesPayload), channelID])
    : [channelID];
  return buildProfilesInputWithChannelIDs(profilesPayload, targetIDs);
}

function buildProfilesInputWithChannelIDs(profilesPayload, channelIDs) {
  const activeProfile = profilesPayload.activeProfile || "default";
  const profiles = Array.isArray(profilesPayload.profiles) && profilesPayload.profiles.length
    ? profilesPayload.profiles.map((profile) => ({ ...profile }))
    : [{ name: activeProfile }];
  const target = profiles.find((profile) => profile.name === activeProfile) || profiles[0];
  target.name = target.name || activeProfile;
  target.channelIDs = uniqueChannelIDs(channelIDs);
  target.channelTags = Array.isArray(target.channelTags) ? target.channelTags : [];
  target.channelTagsMatchMode = target.channelTagsMatchMode || "any";
  target.modelMappings = Array.isArray(target.modelMappings) ? target.modelMappings : [];
  target.modelIDs = Array.isArray(target.modelIDs) ? target.modelIDs : [];
  target.channelBindingMode = "manual";
  target.dynamicChannelStrategy = null;
  return { activeProfile, profiles };
}

function getActiveProfile(profilesPayload) {
  const activeProfile = profilesPayload?.activeProfile || "default";
  const profiles = Array.isArray(profilesPayload?.profiles) ? profilesPayload.profiles : [];
  return profiles.find((profile) => profile.name === activeProfile) || profiles[0] || {};
}

function currentProfileChannelIDs(profilesPayload) {
  return uniqueChannelIDs(getActiveProfile(profilesPayload).channelIDs || []);
}

function uniqueChannelIDs(channelIDs) {
  const ids = [];
  const seen = new Set();
  for (const id of channelIDs || []) {
    const numericID = extractNumericChannelID(id);
    if (!numericID || seen.has(numericID)) continue;
    seen.add(numericID);
    ids.push(numericID);
  }
  return ids;
}

function moveChannelIDToIndex(channelIDs, channelID, targetIndex) {
  const numericID = extractNumericChannelID(channelID);
  const currentIndex = channelIDs.indexOf(numericID);
  const nextIndex = Math.max(0, Math.min(channelIDs.length - 1, Number(targetIndex) || 0));
  if (!numericID || currentIndex < 0 || currentIndex === nextIndex) return channelIDs;
  const nextIDs = [...channelIDs];
  const [item] = nextIDs.splice(currentIndex, 1);
  nextIDs.splice(nextIndex, 0, item);
  return nextIDs;
}

