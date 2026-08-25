const baseAgeApi = 'https://service.ageofempires.com/api';
const modsApi = 'https://api.ageofempires.com/api/v1/mods';
//const bugsApi = 'http://localhost:5000/api/v1/bugs';
const bugsApi = 'https://api.ageofempires.com/api/v1/bugs';

const baseClansApi = '/wp-admin/admin-ajax.php';
const baseStaticApi = "../json";

const baseStatsApi = 'https://api.ageofempires.com/api';
const baseStatsV2Api = 'https://api.ageofempires.com/api/v2';

// Object properties that were previously here for stats page - like on /stats/ageiide/ -
// are now on /scripts/routes/pageTemplatePageStatsGameBlade.js so they only run on stats pages.
const config = {
  api: {
    baseStatsApi,
    baseStatsV2Api,
    clansAction: `${baseClansApi}?action=clanActions`,
    clansFlag: `${baseStaticApi}?action=clanFlag`,
    clansApplicantsList: `${baseClansApi}?action=applicants`,
    clansBlockedList: `${baseClansApi}?action=blocked`,
    clansMembersList: `${baseClansApi}?action=members`,
    clansMemberProfile: `${baseClansApi}?action=clansMemberProfile`,
    clansSearchFilters: `/wp-content/plugins/Clubs/scripts/json/clansSearchFilters.json`,
    clansSearchResults: `${baseClansApi}?action=clans`,
    modsFind: `${modsApi}/Find`,
    modsFindAsUser: `${modsApi}/FindAsUser`,
    modsInstall: `${modsApi}/Install`,
    modsInstalled: `${modsApi}/Installed`,
    modsUninstall: `${modsApi}/Uninstall`,
    modsMine: `${modsApi}/My`,
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
    bugCreate: `${bugsApi}/Submit`,
    bugGetList: `${bugsApi}/GetList`,
    bugGetDetail: `${bugsApi}/BugDetail`,
    bugUpdate: `${bugsApi}/UpdateBug`,
    bugGetAsset: `${bugsApi}/GetAsset`,
    games: `${baseAgeApi}/Games`,
    clans: `${baseClansApi}?action=clans`,
    ClansCheckExisting: `${baseClansApi}?action=clans_check_exists`,
    ClansCheckExistingClan: `${baseClansApi}?action=clans_clan_exists`,
    clansDetail: `${baseClansApi}?action=clans&paged=1&postsPerPage=1`,
    clansSave: `${baseClansApi}?action=clans_save`,
    clansEdit: `${baseClansApi}?action=clans_edit`,
    clubReserve: `${baseClansApi}?action=club_reserve`,
    clansLogoBgs: `${baseAgeApi}/clans/GetImages?key=logo_backgrounds`,
    clansLogoShields: `${baseAgeApi}/clans/GetImages?key=logo_shields`,
    clansLogoIcons: `${baseAgeApi}/clans/GetImages?key=logo_icons`,
    clansBgs: `${baseAgeApi}/clans/GetImages?key=background_images`,
    CountryList: 'https://webapi.ageofempires.com/api/CountryList',
    getJuicerFeed: `${baseAgeApi}/Static/juicer?juicer_feed_name=ageofempires`,
    campaignStats: `${baseStatsApi}/AgeDE/GetCampaign`,
    Age2campaignStats: `${baseStatsApi}/AgeII/GetCampaign`,
    SPFull: `${baseStatsApi}/AgeDE/GetSPFull`,
    MPFull: `${baseStatsApi}/AgeDE/GetMPFull`,
    Age2MPFull: `${baseStatsV2Api}/AgeII/GetMPFull`,
    Age2SPFull: `${baseStatsApi}/AgeII/GetSPFull`,
    MPMatchList: `${baseStatsApi}/AgeDE/getmpmatchlist`,
    SPMatchList: `${baseStatsApi}/AgeDE/getspmatchlist`,
    Age2MPMatchList: `${baseStatsV2Api}/AgeII/GetMPMatchList`,
    Age2SPMatchList: `${baseStatsApi}/AgeII/GetSPMatchList`,
    validateGamertag: `${baseAgeApi}/ValidateUserName`,
    getMatchDetail: `${baseStatsApi}/AgeDE/getmatchdetail`,
    getAge2MatchDetail: `${baseStatsV2Api}/AgeII/GetMPMatchDetail`,
    getAge2MatchReplay: `https://aoe.ms/replay`,
    statsCiv: `${baseStaticApi}/statsCiv.json`,
    statsTimeOfAge: `${baseStaticApi}/statsTimeOfAge.json`,
    subscriptions: `https://subscribe.microsoftstudios.com/api/subscriptions/GetNewsletters?email=`,
    surveyCreate: 'https://survey.ageofempires.com/survey/create_survey.php',
    unsubscribe: `https://subscribe.microsoftstudios.com/api/subscriptions/UnsubscribeEmail`,
    languages: `${baseAgeApi}/Languages?gameId=aoe`,
    contextStore: 'https://assets.xbox.com/xbox-store-web-sdk/latest/purchaseHost.js',
  },
  events: {
    onClansSearch: 'onClansSearch',
    onClansSearchResults: 'onClansSearchResults',
    onPagination: 'onPagination',
  },
  hasTouch: Boolean('ontouchstart' in window || navigator.maxTouchPoints || navigator.msMaxTouchPoints),
  isMobileDevice: window.wp_object.devices.isMobile,
  userLoggedIn: window.wp_object.user_logged_in.status,
  acctType: window.wp_object.acctType,
  AOEStatsService: {
    Application_ID: '02baa1cb-3518-4416-9c56-3facc30e7067',
    Object_ID: '0aa458f4-6a1a-485f-8cbb-ab1ef74cde28',
  },
};
export default config;
