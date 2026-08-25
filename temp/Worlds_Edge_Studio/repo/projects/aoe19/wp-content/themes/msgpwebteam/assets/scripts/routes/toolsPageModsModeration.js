import ModsModerate from '../component/ModsModeration';

export default {
	init() {
		new ModsModerate();
		$('#flagged_table').DataTable();
	},
};