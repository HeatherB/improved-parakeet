const baseAgeApi = 'https://service-dev.ageofempires.com/api';
const modsApi = 'https://api-dev.ageofempires.com/api/v1/mods';
const modsApiV4 = 'https://api-dev.ageofempires.com/api/v4/mods';

const config = {
  api: {
    modsFind: `${modsApi}/FindAsUser`,
    modsInstall: `${modsApi}/Install`,
    modsInstalled: `${modsApi}/Installed`,
    modsUninstall: `${modsApi}/Uninstall`,
    modsMine: `${modsApi}/My`,
    modsAnonDetail: `${modsApi}/AnonDetail`,
    modsDetail: `${modsApi}/Detail`,
    modsDownload: `${modsApi}/Download`,
    modsLike: `${modsApi}/Like`,
    modsFlag: `${modsApi}/Flag`,
    modsTypes: `${modsApi}/Types`,
    modsTags: `${modsApi}/Tags`,
    modsCreate: `${modsApi}/Create`,
    modsEdit: `${modsApi}/Edit`,
    modsDelete: `${modsApi}/Delete`,
    modsFlagged: `${modsApi}/GetFlagged`,
    modsFlaggedDetail: `${modsApi}/GetFlaggedDetail`,
    modsModerate: `${modsApi}/Moderate`,
    TwitterFeed: 'https://webapi.ageofempires.com/api/Twitter',
  },
  apiV4: {
      modsFind: `${modsApiV4}/Find`,
      modsInstall: `${modsApiV4}/Subscribe`,
      modsInstalled: `${modsApiV4}/Installed`,
      modsUninstall: `${modsApiV4}/UnSubscribe`,
      modsMine: `${modsApiV4}/My`,      
      modsDetail: `${modsApiV4}/Detail/`,      
      modsLike: `${modsApiV4}/Like`,
      modsFlag: `${modsApiV4}/Report`,
      modsTypes: `${modsApiV4}/Types`,
      modsTags: `${modsApiV4}/Tags`,
      modsPublish: `${modsApiV4}/Publish`,
      modsPublishFile: `${modsApiV4}/PublishFile`,
      modsDelete: `${modsApiV4}/Delete`,
      modsFlagged: `${modsApiV4}/GetFlagged`,
      modsFlaggedDetail: `${modsApiV4}/GetFlaggedDetail`,
      modsModerate: `${modsApiV4}/Moderate`,
      games: `${baseAgeApi}/Games`,
  },
  userLoggedIn: true,
};
export default config;
