module.exports = {
  alias: 'slides',	
  extend: 'apostrophe-pieces',
  name: 'slide',
  label: 'Slide',
  pluralLabel: 'Slides',
  addFields: [
    {
      name: 'title',
      label: 'Name of slide',
      type: 'string',
      required: true
    },
    {
      name: 'headline',
      label: 'Headline',
      type: 'string',
      required: true
    },
    {
      name: 'bodycopy',
      label: 'Body Copy',
      type: 'string',
      required: true
    },
    {
      name: 'btnlabel',
      label: 'Button Copy',
      type: 'string',
      required: true
    },
    {
      name: 'btnlink',
      label: 'Button Link',
      type: 'string',
      required: true
    },
    {
      name: 'slidevid',
      label: 'Slide Video',
      type: 'string',
      required: false
    },
    {
      name: 'imgpath',
      label: 'Slide Image',
      type: 'string',
      required: false
    },
    {
      name: 'leftcolor',
      label: 'Left Color',
      type: 'string',
      required: true
    },
    {
      name: 'rightcolor',
      label: 'Right Color',
      type: 'string',
      required: true
    }
    /*{
      name: 'slideimg',
      label: 'Slide Image',
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
      name: 'slideinfo',
      label: 'Slide Info',
      fields: ['title', 'headline', 'bodycopy', 'btnlabel', 'btnlink', 'slidevid', 'imgpath', 'leftcolor', 'rightcolor']
    }
  ]
};