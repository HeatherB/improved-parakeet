module.exports = {
  alias: 'games',	
  extend: 'apostrophe-pieces',
  name: 'game',
  label: 'Game',
  alias: 'games',
  pluralLabel: 'Games',
  addFields: [
    {
      name: 'title',
      label: 'Name of Game',
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
      name: 'imgpath',
      labe: 'Game Image',
      type: 'string',
      required: false
    },
    {
      name: 'iconxbox',
      label: 'XBOX',
      type: 'boolean',
      required: false
    },
    {
      name: 'iconwin',
      label: 'Windows / PC',
      type: 'boolean',
      required: false
    },
    {
      name: 'iconmac',
      label: 'Mac / OSX',
      type: 'boolean',
      required: false
    },
    {
      name: 'iconps',
      label: 'PS4',
      type: 'boolean',
      required: false
    },
    {
      name: 'iconswitch',
      label: 'Switch',
      type: 'boolean',
      required: false
    }
  ],
  arrangeFields: [
    {
      name: 'gametile',
      label: 'Game Tile',
      fields: ['title', 'bodycopy', 'btnlabel', 'btnlink', 'imgpath', 'iconxbox', 'iconwin', 'iconmac', 'iconps', 'iconswitch']
    }
  ]

};

