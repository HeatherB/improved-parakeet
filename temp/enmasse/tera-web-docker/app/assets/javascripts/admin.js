// Use this to customize the visual editor boot process
// Just mirror the options specified in your visual editor's config with the new
// options here.  This will completely override anything specified in your visual
// editor's boot process for that key, e.g. skin: 'something_else'

if (typeof(custom_visual_editor_boot_options) == "undefined") {
  custom_visual_editor_boot_options = {
  	classesItems: [
	{name: 'text-align', rules:[{name: 'left', title: '{Left}'}, {name: 'center', title: '{Center}'}, {name: 'right', title: '{Right}'}, {name: 'justify', title: '{Justify}'}], join: '-', title: '{Text_Align}'}
	, {name: 'font-size', rules:[{name: 'small', title: '{Small}'}, {name: 'normal', title: '{Normal}'}, {name: 'large', title: '{Large}'}], join: '-', title: '{Font_Size}'}
	, {name: 'list-style', rules:[{name: 'square', title: 'Square'}, {name: 'decimal', title: 'Decimal'}, {name: 'upperalpha', title: 'Upper Alpha'}, {name: 'lowerroman', title: 'Lower Roman'}], join: '-', title: 'List Style'}
	, {name: 'font-weight', rules:[{name: 'regular', title: 'Regular'}, {name: 'bold', title: 'Bold'}, {name: 'black', title: 'Black'}], join: '-', title: 'Font Weight'}
	]
  };
}
