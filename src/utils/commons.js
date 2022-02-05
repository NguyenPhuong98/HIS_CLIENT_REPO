export const StringToObject = (strings) => {
	let object = strings.split('; ').map((string) => {
		let splitSring = string.split('&');
		return { ID: splitSring[0], Name: splitSring[1] };
	});
	return object;
};

export const fixedTime = (time) => {
	let timeOrigin = time;
	let isoTime = new Date(new Date(timeOrigin).toISOString());
	let fixedTime = new Date(isoTime.getTime() - timeOrigin.getTimezoneOffset() * 60000);

	return fixedTime;
};

export const DatetimeToString = (dt) => {
	return `${(dt.getMonth() + 1).toString().padStart(2, '0')}/${dt.getDate().toString().padStart(2, '0')}/${dt
		.getFullYear()
		.toString()
		.padStart(4, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt
		.getSeconds()
		.toString()
		.padStart(2, '0')}`;
};
