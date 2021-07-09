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
