// This configures the apostrophe-pages module to add a "home" page type to the
// pages menu

module.exports = {
  types: [
    {
      name: 'default',
      label: 'Default'
    },
    {
      name: 'legal',
      label: 'Legal'
    },
    {
      name: 'games',
      label: 'Games'
    },
    {
      name: 'jobs',
      label: 'Jobs'
    },
    {
      name: 'devportal',
      label: 'Developer Portal'
    },
    {
      name: 'partnerprogram',
      label: 'Partner Program'
    },
    {
      name: 'receipt',
      label: 'Receipt'
    },
    {
      name: 'dc_release',
      label: 'DC Release'
    },
    {
      name: 'quiz',
      label: 'Quiz'
    },
    {
      name: 'home',
      label: 'Home'
    }

    // Add more page types here, but make sure you create a corresponding
    // template in lib/modules/apostrophe-pages/views/pages!
  ]
};
