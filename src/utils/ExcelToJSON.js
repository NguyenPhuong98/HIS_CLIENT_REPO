import * as XLSX from 'xlsx';

const readExcel = () => {
	var url = 'https://docs.google.com/spreadsheets/d/1aXP5Qq2P1jJURifiyMRKSy2dzKfeKzc3/edit#gid=469542223';

	var Req = new XMLHttpRequest();
	Req.open('GET', url, true);
	Req.responseType = 'arraybuffer';
	Req.onload = (e) => {
		var arraybuffer = Req.response;
		/* convert data to binary string */
		var data = new Uint8Array(arraybuffer);
		var arr = new Array();
		for (var i = 0; i !== data.length; ++i) arr[i] = String.fromCharCode(data[i]);
		var bstr = arr.join('');
		console.log('data', data);

		/* Call XLSX */
		var workbook = XLSX.read(bstr, { type: 'binary' });

		/* DO SOMETHING WITH workbook HERE */
		var first_sheet_name = workbook.SheetNames[1];
		/* Get worksheet */
		var worksheet = workbook.Sheets[first_sheet_name];
		console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
	};
	Req.send();
	const filePath = 'PhieuChamSoc.xlsx';
	const workbook = XLSX.readFile(filePath);
	const worksheet = workbook.Sheets[workbook.SheetNames[1]];
	console.log(worksheet);
};

export default readExcel;
