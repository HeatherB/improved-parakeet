import ShortUrlAdmin from '../component/ShortUrlAdmin';

export default {
	init() {
		new ShortUrlAdmin();
		$('#url_table').DataTable();
	},
};