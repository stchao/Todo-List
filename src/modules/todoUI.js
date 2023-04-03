import { formatDistanceToNow } from 'date-fns';
import { getClickableIconElement } from '..';
import { TodoListStorage } from './todoListStorage';
import { Action, UIActions } from './uiActions';
import editIcon from '../images/pencil.png';
import deleteIcon from '../images/delete.png';

export const TodoUI = (() => {
	const _toggleTodoContent = (ev, contentElement) => {
		let targetElement = ev.target;
		while (!targetElement.id && targetElement.tagName !== 'BUTTON') {
			targetElement = targetElement.parentElement;
		}

		if (
			targetElement.id ||
			!contentElement ||
			ev.target.tagName === 'IMG' ||
			ev.target.tagName === 'INPUT'
		) {
			return;
		}

		targetElement.classList.toggle('active');

		if (contentElement.style.maxHeight) {
			contentElement.style.maxHeight = null;
		} else {
			contentElement.style.maxHeight = contentElement.scrollHeight + 'px';
		}
	};

	const _getSpan = (text, classes) => {
		const span = document.createElement('span');
		span.textContent = text;

		if (classes) {
			span.classList.add(
				...(Array.isArray(classes) ? classes : [classes])
			);
		}

		return span;
	};

	const _addRemoveButtonAnimation = (element = null) => {
		if (!element) {
			return;
		}

		element.addEventListener('transitionend', () => {
			element?.remove();
		});

		element.style.transition = 'grid-template-rows 0.3s linear';
		element.style.padding = 0;
		element.style.gridTemplateRows = 0;
	};

	const _addRemoveContentAnimation = (element = null) => {
		if (!element) {
			return;
		}

		element.addEventListener('transitionend', () => {
			element?.remove();
		});

		if (!element.style.maxHeight) {
			element.style.transition = 'border-top-width 0.3s linear';
			element.style.borderWidth = 0;
			return;
		}

		element.style.transition = 'max-height 0.3s linear';
		element.style.padding = 0;
		element.style.maxHeight = 0;
	};

	const _removeTodo = (uuid, todoButton = null, todoContent = null) => {
		TodoListStorage.removeTodo(uuid);
		_addRemoveButtonAnimation(todoButton);
		_addRemoveContentAnimation(todoContent);
	};

	const _updateLastModified = (
		ev,
		lastModifiedInMS = Date.now(),
		lastModified = null,
		todoContent = null
	) => {
		const distanceToNow = formatDistanceToNow(new Date(lastModifiedInMS));
		lastModified.innerText = `Last Updated: ${distanceToNow} ago`;
		_toggleTodoContent(ev, todoContent);
	};

	const _getCompletedElement = (todo) => {
		const completedElement = document.createElement('input');
		completedElement.type = 'checkbox';
		completedElement.checked = todo.completed;
		completedElement.classList.add('todo-completed', 'icon');
		completedElement.addEventListener('click', (ev) => {
			todo.completed = ev.target.checked;
			UIActions.executeAction({ action: Action.UpdateTodo }, todo);
		});

		return completedElement;
	};

	const _getTodoButton = (todo, lastModified, todoContent) => {
		const todoButton = document.createElement('button');
		todoButton.type = 'button';
		todoButton.classList.add(
			'grid-center-center',
			'collapsible',
			'font-large',
			'font-bold'
		);
		todoButton.addEventListener('click', (ev) => {
			_updateLastModified(
				ev,
				todo.lastModifiedInMS,
				lastModified,
				todoContent
			);
		});

		return todoButton;
	};

	const _getTodoActionContainer = (todo, todoButton, todoContent) => {
		const todoActionContainer = document.createElement('div');
		const dueDate = todo.dueDate || 'N/A';
		const dueDateElement = _getSpan(`Due: ${dueDate}`, 'todo-due-date');

		const editTodoElement = getClickableIconElement(editIcon);
		editTodoElement.addEventListener('click', () => {
			UIActions.showModal(
				Action.UpdateTodo,
				todo.uuid,
				todoButton,
				todoContent
			);
		});

		const deleteTodoElement = getClickableIconElement(deleteIcon);
		deleteTodoElement.addEventListener('click', () => {
			_removeTodo(todo.uuid, todoButton, todoContent);
		});

		todoActionContainer.classList.add(
			'grid-center-center',
			'todo-action-container'
		);
		todoActionContainer.appendChild(editTodoElement);
		todoActionContainer.appendChild(deleteTodoElement);
		todoActionContainer.appendChild(dueDateElement);

		return todoActionContainer;
	};

	const _getAllTodoElements = (todos) => {
		const todosFragment = document.createDocumentFragment();

		for (const todoUuid in todos) {
			const todoElement = getTodoElement(todos[todoUuid]);
			todosFragment.appendChild(todoElement);
		}

		return todosFragment;
	};

	const getTodoElement = (todo) => {
		const todoContent = document.createElement('div');
		const descriptionLabel = _getSpan('Description:', [
			'todo-description-label',
			'font-bold',
		]);
		const description = _getSpan(todo.description, 'todo-description');
		const priority = _getSpan(`Priority: ${todo.priority}`, [
			'todo-priority',
			'font-bold',
		]);
		const distanceToNow = formatDistanceToNow(
			new Date(todo.lastModifiedInMS)
		);
		const lastModified = _getSpan(
			`Last Updated: ${distanceToNow} ago`,
			'todo-last-modified'
		);
		todoContent.classList.add('grid-center-center', 'todo-content');
		todoContent.appendChild(lastModified);
		todoContent.appendChild(descriptionLabel);
		todoContent.appendChild(priority);
		todoContent.appendChild(description);

		const todoButton = _getTodoButton(todo, lastModified, todoContent);
		const completedElement = _getCompletedElement(todo);
		const todoTitleElement = _getSpan(todo.title, [
			'todo-title',
			'button-text',
		]);
		const todoActionContainer = _getTodoActionContainer(
			todo,
			todoButton,
			todoContent
		);
		todoButton.appendChild(completedElement);
		todoButton.appendChild(todoTitleElement);
		todoButton.appendChild(todoActionContainer);

		const todoFragment = document.createDocumentFragment();
		todoFragment.appendChild(todoButton);
		todoFragment.appendChild(todoContent);
		return todoFragment;
	};

	const updateTodoElement = (args, customObject = null) => {
		switch (args.action) {
			case Action.AddTodo:
				const todosContainer =
					document.querySelector('#todosContainer');
				const addTodo = getTodoElement(customObject);
				todosContainer.appendChild(addTodo);
				break;
			case Action.UpdateTodo:
				const button = args.button;
				const buttonContent = args.buttonContent;

				if (button) {
					const completed = button.querySelector('.todo-completed');
					const title = button.querySelector('.todo-title');
					const dueDate = button.querySelector('.todo-due-date');
					const dueDateText = customObject.dueDate || 'N/A';
					completed.checked = customObject.completed;
					title.textContent = customObject.title;
					dueDate.textContent = `Due: ${dueDateText}`;
				}

				if (buttonContent) {
					const description =
						buttonContent.querySelector('.todo-description');
					const priority =
						buttonContent.querySelector('.todo-priority');
					const distanceToNow = formatDistanceToNow(
						new Date(customObject.lastModifiedInMS)
					);
					const lastModified = buttonContent.querySelector(
						'.todo-last-modified'
					);
					description.textContent = customObject.description;
					priority.textContent = `Priority: ${customObject.priority}`;
					lastModified.textContent = `Last Updated: ${distanceToNow} ago`;
					buttonContent.style.maxHeight = buttonContent.style
						.maxHeight
						? buttonContent.scrollHeight + 'px'
						: null;
				}
				break;
			default:
				return;
		}
	};

	const showTodoElements = (todos = null) => {
		if (!todos) {
			const currentProject = TodoListStorage.getActiveProject();
			todos = currentProject?.todos;
		}

		const todosContainer = document.querySelector('#todosContainer');
		const todoElements = _getAllTodoElements(todos);
		todosContainer.textContent = '';
		todosContainer.appendChild(todoElements);
	};

	return { getTodoElement, updateTodoElement, showTodoElements };
})();
