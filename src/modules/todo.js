import { v4 as uuidv4 } from 'uuid';

export const Priority = {
	Low: 'Low',
	Medium: 'Medium',
	High: 'High',
};

export const Todo = (
	title = '',
	description = '',
	dueDate = new Date(),
	priority = Priority.Low,
	completed = false,
	currentUuid = ''
) => {
	return {
		uuid: currentUuid || uuidv4(),
		title,
		description,
		dueDate,
		priority,
		lastModifiedInMS: Date.now(),
		completed,
	};
};
