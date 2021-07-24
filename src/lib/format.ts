export function toMiles(value = 0) {
	return new Intl.NumberFormat('en-US', {
		style: 'unit',
		unit: 'mile',
		unitDisplay: 'long',
		maximumFractionDigits: 0
	}).format(value);
}

export function toHoursAndMinutesDuration(value = 0) {
	const duration = new Date(value);
	const hours = duration.getUTCHours();
	return `${hours} Hours, ${duration.getUTCMinutes()} Minutes`;
}

export function getISODate(value?: Date) {
	return new Date(
		Date.UTC(
			value.getFullYear(),
			value.getMonth(),
			value.getDate(),
			value.getHours(),
			value.getMinutes()
		)
	)
		?.toISOString()
		.substr(0, 10);
}

export function getISOTime(value?: Date) {
	return new Date(
		Date.UTC(
			value.getFullYear(),
			value.getMonth(),
			value.getDate(),
			value.getHours(),
			value.getMinutes()
		)
	)
		?.toISOString()
		.substr(11, 5);
}

export function toDateObject(date: string, time: string) {
	const [year, month, day] = date.split('-');
	const [hours, minutes] = time.split(':');
	return new Date(+year, +month - 1, +day, +hours, +minutes);
}

export function toTimeString(value: string | Date) {
	return new Date(value).toLocaleTimeString('en-US', {
		timeStyle: 'short',
		hourCycle: 'h24'
	});
}

export function toTimeRangeString(start: string | Date, end: string | Date) {
	const range = [toTimeString(start), toTimeString(end)];
	const [rangeStart, rangeEnd] = range;
	if (rangeStart === rangeEnd) return rangeStart;
	return rangeStart === rangeEnd ? rangeStart : range.join(' - ');
}
