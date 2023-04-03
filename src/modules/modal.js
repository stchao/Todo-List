import format from 'date-fns/format';
import { Priority } from './todo';

export const TagId = {
	title: 'titleInput',
	description: 'todoDescriptionInput',
	dueDate: 'todoDueDateInput',
	priority: 'todoPrioritySelect',
	completed: 'todoCompletedCheckbox',
};

export const Modal = (() => {
	const _titleAttributes = {
		id: TagId.title,
		name: 'title',
		type: 'text',
		minlength: 1,
		maxlength: 200,
	};

	const _descriptionAttributes = {
		id: TagId.description,
		name: 'todo_description',
		type: 'text',
		minlength: 1,
		maxlength: 200,
		rows: 5,
		cols: 50,
	};

	const _descriptionProperties = {
		value: null,
	};

	const _dueDateAttributes = {
		id: TagId.dueDate,
		name: 'todo_due_date',
		type: 'date',
		value: format(new Date(), 'yyyy-MM-dd'),
	};

	const _priorityAttributes = {
		id: TagId.priority,
		name: 'todo_priority',
	};

	const _priorityProperties = {
		value: Priority.Low,
	};

	const _completedAttributes = {
		id: TagId.completed,
		name: 'todo_completed',
		type: 'checkbox',
		class: 'icon',
	};

	const _getForm = (
		formContent,
		actionFunction,
		actionLabel = null,
		args = null,
		tempObject = null
	) => {
		const modalContainer = document.createElement('div');
		const form = document.createElement('form');
		const closeButton = document.createElement('button');
		const actionButton = document.createElement('button');

		closeButton.type = 'button';
		closeButton.classList.add('button', 'close-button');
		closeButton.textContent = 'x';
		closeButton.addEventListener('click', () => {
			modalContainer?.remove();
		});

		actionButton.type = 'button';
		actionButton.classList.add('button');
		actionButton.textContent = actionLabel || 'Button';
		actionButton.addEventListener('click', () => {
			actionFunction(args, tempObject);
			modalContainer?.remove();
		});

		modalContainer.classList.add('flex-center-center', 'modal-background');

		form.appendChild(closeButton);
		form.appendChild(formContent);
		form.appendChild(actionButton);
		modalContainer.appendChild(form);

		return modalContainer;
	};

	const getFormItem = (
		labelText,
		tagName,
		tagAttributes = null,
		tagChildArgs = null,
		tagProperties = null,
		isTagRequired = false
	) => {
		const formItemContainer = document.createElement('div');
		const label = document.createElement('label');
		const tag = document.createElement(tagName || 'input');

		label.textContent = labelText || 'Label';
		label.setAttribute('for', tagAttributes?.id || '');

		for (const attribute in tagAttributes) {
			tag.setAttribute(attribute, tagAttributes[attribute]);
		}

		if (isTagRequired) {
			const requiredSpan = document.createElement('span');
			requiredSpan.textContent = '*';
			requiredSpan.setAttribute('aria-label', 'required');

			label.appendChild(requiredSpan);
			tag.setAttribute('required', '');
		}

		if (tagChildArgs && tagChildArgs?.constructor === Object) {
			for (const childTagName in tagChildArgs) {
				let childValues = tagChildArgs[childTagName];

				if (!Array.isArray(childValues)) {
					childValues = new Array(childValues);
				}

				childValues.forEach((childValue) => {
					const tempTag = document.createElement(childTagName);
					tempTag.value = childValue;
					tempTag.textContent = childValue;
					tag.appendChild(tempTag);
				});
			}
		}

		for (const property in tagProperties) {
			tag[property] = tagProperties[property];
		}

		formItemContainer.appendChild(label);
		formItemContainer.appendChild(tag);
		formItemContainer.classList.add('flex-center-center', 'form-row');

		return formItemContainer;
	};

	const getProjectForm = (
		actionFunction,
		actionLabel = null,
		tempProject = null,
		args = null
	) => {
		let tempTitleAttributes = _titleAttributes;

		if (tempProject) {
			tempTitleAttributes = JSON.parse(JSON.stringify(_titleAttributes));
			tempTitleAttributes.value = tempProject.title;
		}

		const title = getFormItem('Title', 'input', tempTitleAttributes);
		return _getForm(title, actionFunction, actionLabel, args, tempProject);
	};

	const getTodoForm = (
		actionFunction,
		actionLabel = null,
		tempTodo = null,
		args = null
	) => {
		const formContent = document.createDocumentFragment();
		const completedPriorityContainer = document.createElement('div');
		let tempTitleAttributes = _titleAttributes;
		let tempDescriptionProperties = _descriptionProperties;
		let tempDueDateAttributes = _dueDateAttributes;
		let tempPriorityProperties = _priorityProperties;
		let tempCompletedAttributes = _completedAttributes;

		if (tempTodo) {
			tempTitleAttributes = JSON.parse(JSON.stringify(_titleAttributes));
			tempDescriptionProperties = JSON.parse(
				JSON.stringify(_descriptionProperties)
			);
			tempDueDateAttributes = JSON.parse(
				JSON.stringify(_dueDateAttributes)
			);
			tempPriorityProperties = JSON.parse(
				JSON.stringify(_priorityProperties)
			);
			tempCompletedAttributes = JSON.parse(
				JSON.stringify(_completedAttributes)
			);
			tempTitleAttributes.value = tempTodo.title;
			tempDescriptionProperties.value = tempTodo.description;
			tempDueDateAttributes.value = tempTodo.dueDate;
			tempPriorityProperties.value = tempTodo.priority;
			if (tempTodo.completed) {
				tempCompletedAttributes.checked = '';
			}
		}

		const title = getFormItem('Title', 'input', tempTitleAttributes);
		const description = getFormItem(
			'Description',
			'textarea',
			_descriptionAttributes,
			null,
			tempDescriptionProperties
		);
		const dueDate = getFormItem('Due Date', 'input', tempDueDateAttributes);
		const priority = getFormItem(
			'Priority',
			'select',
			_priorityAttributes,
			{ option: Object.keys(Priority) },
			tempPriorityProperties
		);
		const completed = getFormItem(
			'Completed',
			'input',
			tempCompletedAttributes
		);
		completedPriorityContainer.id = 'todoStatusContainer';
		completedPriorityContainer.classList.add('flex-center-center');
		completedPriorityContainer.append(priority, completed);
		formContent.append(
			dueDate,
			title,
			description,
			completedPriorityContainer
		);
		return _getForm(
			formContent,
			actionFunction,
			actionLabel,
			args,
			tempTodo
		);
	};

	return { getFormItem, getProjectForm, getTodoForm };
})();
