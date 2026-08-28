module.exports = {
  alias: 'dcmedias',	
  extend: 'apostrophe-pieces',
  name: 'dcmedia',
  label: 'Dcmedia',
  pluralLabel: 'Dcmedias',
  addFields: [
    {
      name: 'mediavid',
      label: 'Video ID',
      type: 'string',
      required: false
    },
    {
      name: 'mediaimgpath',
      label: 'Image',
      type: 'string',
      required: false
    }
  ],
  arrangeFields: [
    {
      name: 'mediainfo',
      label: 'Media Info',
      fields: ['mediavid', 'mediaimgpath']
    }
  ]
};