const modsApi = 'https://api-dev.ageofempires.com/api/v1/mods';
const ageApiUrl = 'https://api-dev.ageofempires.com';
const baseCdnUrl = 'https://cdn.ageofempires.com/aoe';
const baseClansApi = '/wp-admin/admin-ajax.php';

const config = {
  api: {
    clansAction: `${baseClansApi}?action=clanActions`,
    clansFlag: `${baseClansApi}?action=clanFlag`,
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
    clans: `${baseClansApi}?action=clans`,
    ClansCheckExisting: `${baseClansApi}?action=clans_check_exists`,
    ClansCheckExistingClan: `${baseClansApi}?action=clans_clan_exists`,
    clansDetail: `${baseClansApi}?action=clans&paged=1&postsPerPage=1`,
    clansSave: `${baseClansApi}?action=clans_save`,
    clansEdit: `${baseClansApi}?action=clans_edit`,
    clubReserve: `${baseClansApi}?action=club_reserve`,
    clansLogoBgs: `${baseCdnUrl}/wp-content/themes/msgpwebteam/assets/json/clans_logo_backgrounds.json`,
    clansLogoShields: `${baseCdnUrl}/wp-content/themes/msgpwebteam/assets/json/clans_logo_shields.json`,
    clansLogoIcons: `${baseCdnUrl}/wp-content/themes/msgpwebteam/assets/json/clans_logo_icons.json`,
    clansBgs: `${baseCdnUrl}/wp-content/themes/msgpwebteam/assets/json/clans_background_images.json`,
    languages: `${ageApiUrl}/webapi/Languages?gameId=aoe`,
  },
  
};
export default config;
