export function isEmpty(val?: string): boolean {
	return val?.trim().length === 0;
}

export function isValidEmail(val?: string): boolean {
	const pattern =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return pattern.test(val?.toLowerCase());
}

export function isValidURL(str?: string) {
	const pattern = new RegExp(
		'^(https?:\\/\\/)?' +
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
			'((\\d{1,3}\\.){3}\\d{1,3}))' +
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
			'(\\?[;&a-z\\d%_.~+=-]*)?' +
			'(\\#[-a-z\\d_]*)?$',
		'i'
	);
	return !!pattern.test(str);
}

export function isValidDate(date: string | Date) {
	return (
		(date instanceof Date && date.toDateString() !== 'Invalid Date') ||
		(Boolean(date) && !Number.isNaN(new Date(date).getTime()))
	);
}

export function isValidDateRange(startDate: string | Date, endDate: string | Date) {
	return (
		isValidDate(startDate) &&
		isValidDate(endDate) &&
		(() => {
			const [startTimeStamp, endTimeStamp] = [
				new Date(startDate).getTime(),
				new Date(endDate).getTime()
			];
			return startTimeStamp <= endTimeStamp;
		})()
	);
}
