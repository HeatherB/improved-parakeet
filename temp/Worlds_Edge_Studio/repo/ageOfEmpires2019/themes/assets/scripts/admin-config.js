const baseAgeApi = 'https://service.ageofempires.com/api';
const modsApi = 'https://api.ageofempires.com/api/v1/mods';

const baseClansApi = '/wp-admin/admin-ajax.php';
const baseStaticApi = '/wp-content/themes/msgpwebteam/assets/json';

const config = {
  api: {
    clansAction: `${baseClansApi}?action=clanActions`,
    clansFlag: `${baseStaticApi}?action=clanFlag`,
    clansApplicantsList: `${baseClansApi}?action=applicants`,
    clansBlockedList: `${baseClansApi}?action=blocked`,
    clansMembersList: `${baseClansApi}?action=members`,
    clansMemberProfile: `${baseClansApi}?action=clansMemberProfile`,    
    clansSearchResults: `${baseClansApi}?action=clans`,
    modsFind: `${modsApi}/Find`,
    modsInstalled: `${modsApi}/Installed`,
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
    games: `${baseAgeApi}/Games`,
    clans: `${baseClansApi}?action=clans`,
    ClansCheckExisting: `${baseClansApi}?action=clans_check_exists`,
    ClansCheckExistingClan: `${baseClansApi}?action=clans_clan_exists`,
    clansDetail: `${baseClansApi}?action=clans&paged=1&postsPerPage=1`,
    clansSave: `${baseClansApi}?action=clans_save`,
    clansEdit: `${baseClansApi}?action=clans_edit`,
    clubReserve: `${baseClansApi}?action=club_reserve`,
    clansLogoBgs: `${baseClansApi}?action=logo_backgrounds`,
    clansLogoShields: `${baseClansApi}?action=logo_shields`,
    clansLogoIcons: `${baseClansApi}?action=logo_icons`,
    clansBgs: `${baseClansApi}?action=background_images`,
    campaignStats: ` ${baseAgeApi}/stats/GetCampaign`,
    SPFull: `${baseAgeApi}/stats/GetSPFull`,
    MPFull: `${baseAgeApi}/stats/GetMPFull`,
    MPMatchList: `${baseAgeApi}/stats/getmpmatchlist`,
    SPMatchList: `${baseAgeApi}/stats/getspmatchlist`,
    validateGamertag: `${baseAgeApi}/ValidateUserName`,
    getMatchDetail: `${baseAgeApi}/stats/getmatchdetail`,
    statsCiv: `${baseStaticApi}/statsCiv.json`,
    statsTimeOfAge: `${baseStaticApi}/statsTimeOfAge.json`,
    subscriptions: `https://subscribe.microsoftstudios.com/api/subscriptions/GetNewsletters?email=`,
    unsubscribe: `https://subscribe.microsoftstudios.com/api/subscriptions/UnsubscribeEmail`,
    languages: `${baseClansApi}?action=get_languages`,
  },
  
};
export default config;
