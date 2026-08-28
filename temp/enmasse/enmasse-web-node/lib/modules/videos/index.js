module.exports = {
  alias: 'videos',	
  extend: 'apostrophe-pieces',
  name: 'video',
  label: 'Video',
  pluralLabel: 'Videos',
  addFields: [
    {
      name: 'title',
      label: 'Name of video',
      type: 'string',
      required: true
    },
    {
      name: 'headline',
      label: 'Headline',
      type: 'string',
      required: false
    },
    {
      name: 'bodycopy',
      label: 'Body Copy',
      type: 'string',
      required: false
    },
    {
      name: 'logopath',
      label: 'Logo',
      type: 'string',
      required: false
    },
    {
      name: 'youtubepath',
      label: 'Youtube Vid',
      type: 'string',
      required: false
    },
    {
      name: 'videopath',
      label: 'Video Vid',
      type: 'string',
      required: false
    }
    /*{
      name: 'videoimg',
      label: 'Video Image',
      type: 'singleton',
      widgetType: 'apostrophe-images',
      options: {
        limit: 1,
        minSize: [ 1366, 509 ],
        aspectRatio: [ 1, 1 ]
      }
    }*/
  ],
  arrangeFields: [
    {
      name: 'videoinfo',
      label: 'Video Info',
      fields: ['title', 'headline', 'bodycopy', 'logopath', 'youtubepath', 'videopath']
    }
  ]
};