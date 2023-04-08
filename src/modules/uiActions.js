import menuIconClosed from '../images/menu.png';
import menuIconOpen from '../images/menu-open.png';
import { TodoListStorage } from './todoListStorage';
import { Modal, TagId } from './modal';
import { TodoUI } from './todoUI';
import { ProjectUI } from './projectUI';
import { formatDistanceToNow } from 'date-fns';
import { SortAction, getSortIcon } from './sieveUI';
import { PriorityMapping } from './todo';
import { formatWithoutTimezone } from './dateFormat';

export const Action = {
	AddTodo: 0,
	UpdateTodo: 1,
	DeleteTodo: 2,
	AddProject: 3,
	UpdateProject: 4,
	DeleteProject: 5,
	UpdateSort: 6,
	RunSort: 7,
	RunFilter: 8,
};

export const UIActions = (() => {
	const _updateTodoElement = (args, customObject = null) => {
		const button = args.button;
		const buttonContent = args.buttonContent;

		switch (args.action) {
			case Action.AddTodo:
				const todosContainer =
					document.querySelector('#todosContainer');
				const addTodo = TodoUI.getTodoElement(customObject);
				todosContainer.appendChild(addTodo);
				break;
			case Action.UpdateTodo:
				if (button) {
					const completed = button.querySelector('.todo-completed');
					const title = button.querySelector('.todo-title');
					const dueDate = button.querySelector('.todo-due-date');
					const dueDateText = formatWithoutTimezone(
						customObject.dueDateISO
					);
					completed.checked = customObject.completed;
					title.textContent = customObject.title;
					dueDate.textContent = `Due: ${dueDateText}`;
					dueDate.dataset.dueDateIso = customObject.dueDateISO;
				}

				if (buttonContent) {
					const description =
						buttonContent.querySelector('.todo-description');
					const priority =
						buttonContent.querySelector('.todo-priority');
					const distanceToNow = formatDistanceToNow(
						new Date(customObject.lastModifiedISO)
					);
					const lastModified = buttonContent.querySelector(
						'.todo-last-modified'
					);
					description.textContent = customObject.description;
					priority.textContent = `Priority: ${customObject.priority}`;
					lastModified.textContent = `Last Updated: ${distanceToNow} ago`;
					lastModified.dataset.lastModifiedIso =
						customObject.lastModifiedISO;
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

	const _updateProjectElement = (args, customObject = null) => {
		switch (args.action) {
			case Action.AddProject:
				const projectsContainer =
					document.querySelector('#projectsContainer');
				const addProject = ProjectUI.getProjectElement(customObject);
				projectsContainer.appendChild(addProject);
			case Action.UpdateProject:
				if (args.button) {
					const title = args.button.querySelector('.project-title');
					title.textContent = customObject.title;
				}
			default:
				return;
		}
	};

	const _updateSortIcon = (
		sortAction = SortAction.SortByCompleted,
		isAscending = true
	) => {
		const sort = document.querySelector('#sortIcon');
		const replacementSortIcon = getSortIcon(sortAction, isAscending);
		sort.replaceWith(replacementSortIcon);
	};

	const _sortTodo = (
		sortAction,
		isAscending = true,
		selector = 'div.todo-content'
	) => {
		let sortFunction = null;

		switch (sortAction) {
			case SortAction.SortByCompleted:
				sortFunction = _sortBool;
				break;
			case SortAction.SortByTitle:
			case SortAction.SortByDescription:
				sortFunction = _sortAlpha;
				break;
			case SortAction.SortByDueDate:
				sortFunction = _sortDate;
				break;
			case SortAction.SortByPriority:
				sortFunction = _sortPriority;
				break;
			case SortAction.SortByLastModified:
				sortFunction = _sortDate;
				break;
			default:
				return;
		}

		const todosContainer = document.querySelector('#todosContainer');
		const todos = [...todosContainer.querySelectorAll(selector)];
		todos.sort((a, b) => sortFunction(a, b, isAscending, sortAction));

		todos.forEach((todo) => {
			if (selector === 'button') {
				todosContainer.append(todo, todo.nextElementSibling ?? '');
				return;
			}

			todosContainer.append(todo.previousElementSibling ?? '', todo);
		});
	};

	const _sortBool = (elementOne, elementTwo, isAscending = true) => {
		const inputOne = elementOne.querySelector('input[type=checkbox]');
		const inputTwo = elementTwo.querySelector('input[type=checkbox]');

		if (inputOne.checked && !inputTwo.checked) {
			return isAscending ? -1 : 1;
		}

		if (!inputOne.checked && inputTwo.checked) {
			return isAscending ? 1 : -1;
		}

		return 0;
	};

	const _sortAlpha = (
		elementOne,
		elementTwo,
		isAscending = true,
		sortAction = SortAction.SortByTitle
	) => {
		const className = sortAction.replace(' ', '-').toLowerCase();
		const spanOne = elementOne.querySelector(`span.todo-${className}`);
		const spanTwo = elementTwo.querySelector(`span.todo-${className}`);

		if (spanOne.innerText < spanTwo.innerText) {
			return isAscending ? -1 : 1;
		}

		if (spanOne.innerText > spanTwo.innerText) {
			return isAscending ? 1 : -1;
		}

		return 0;
	};

	const _sortPriority = (elementOne, elementTwo, isAscending = true) => {
		const spanOne = elementOne.querySelector(`span.todo-priority`);
		const spanTwo = elementTwo.querySelector(`span.todo-priority`);
		const priorityOne = PriorityMapping(spanOne.innerText);
		const priorityTwo = PriorityMapping(spanTwo.innerText);

		if (priorityOne < priorityTwo) {
			return isAscending ? -1 : 1;
		}

		if (priorityOne > priorityTwo) {
			return isAscending ? 1 : -1;
		}

		return 0;
	};

	const _sortDate = (
		elementOne,
		elementTwo,
		isAscending = true,
		sortAction = SortAction.SortByDueDate
	) => {
		const className = sortAction.replace(' ', '-').toLowerCase();
		const spanOne = elementOne.querySelector(`span.todo-${className}`);
		const spanTwo = elementTwo.querySelector(`span.todo-${className}`);
		const dateOneISO =
			spanOne.dataset.dueDateIso || spanOne.dataset.lastModifiedIso;
		const dateTwoISO =
			spanTwo.dataset.dueDateIso || spanTwo.dataset.lastModifiedIso;

		if (!dateOneISO || !dateTwoISO) {
			// moves Due: N/A to the end
			return !dateOneISO ? 1 : -1;
		}

		const dateOne = new Date(dateOneISO);
		const dateTwo = new Date(dateTwoISO);

		if (dateOne < dateTwo) {
			return isAscending ? -1 : 1;
		}

		if (dateOne > dateTwo) {
			return isAscending ? 1 : -1;
		}

		return 0;
	};

	const _filterTodo = (filterText = '', filterInput = null) => {
		if (filterText !== filterInput?.value) {
			return;
		}

		const todosContainer = document.querySelector('#todosContainer');
		const todos = [...(todosContainer?.querySelectorAll('button') ?? [])];

		todos.forEach((todo) => {
			let todoContent = todo.nextElementSibling;

			if (todoContent?.tagName !== 'DIV') {
				todoContent = null;
			}

			const todoTexts = todo.querySelectorAll('span');
			const todoContentTexts =
				todoContent?.querySelectorAll('span') ?? [];
			const spansToScan = [...todoTexts, ...todoContentTexts];
			const isFilterFound = spansToScan.some((span) =>
				span.innerText.toLowerCase().includes(filterText.toLowerCase())
			);

			todo.classList.remove('d-none');
			todoContent?.classList.remove('d-none');

			if (!isFilterFound && filterText) {
				todo.classList.add('d-none');
				todoContent?.classList.add('d-none');
			}
		});
	};

	const executeAction = (args, customObject = null) => {
		const title =
			document.querySelector(`#${TagId.title}`)?.value ||
			new Date().toLocaleString();
		const description =
			document.querySelector(`#${TagId.description}`)?.value || '';
		const dueDate =
			document.querySelector(`#${TagId.dueDate}`)?.value || '';
		const priority =
			document.querySelector(`#${TagId.priority}`)?.value || 'Low';
		const completed =
			document.querySelector(`#${TagId.completed}`)?.checked ?? false;

		switch (args.action) {
			case Action.AddTodo:
				customObject = TodoListStorage.addTodo();
			case Action.UpdateTodo:
				customObject.title = title;
				customObject.description = description;
				customObject.dueDateISO = dueDate
					? new Date(dueDate).toISOString()
					: '';
				customObject.priority = priority;
				customObject.completed = completed;
				customObject.lastModifiedISO = new Date().toISOString();
				TodoListStorage.updateTodo(customObject);
				break;
			case Action.DeleteTodo:
				TodoListStorage.removeTodo(customObject.uuid);
				break;
			case Action.AddProject:
				customObject = TodoListStorage.addProject();
			case Action.UpdateProject:
				customObject.title = title;
				customObject.lastModifiedISO = new Date().toISOString();
				TodoListStorage.updateProjectTitle(customObject);
				break;
			case Action.DeleteProject:
				TodoListStorage.removeProject(customObject.uuid);
				break;
			case Action.UpdateSort:
				_updateSortIcon(args.sortAction, args.isAscending ?? true);
				return;
			case Action.RunSort:
				_sortTodo(
					args.sortAction,
					args.isAscending ?? true,
					args.selector || 'div.todo-content'
				);
				return;
			case Action.RunFilter:
				_filterTodo(args.filterText, args.filterInput);
				return;
			default:
				return;
		}

		_updateTodoElement(args, customObject);
		_updateProjectElement(args, customObject);
	};

	const showModal = (
		action,
		uuid = '',
		button = null,
		buttonContent = null
	) => {
		const container = document.querySelector('#container');
		let args = { action, button, buttonContent };
		let modal = null;
		let actionLabel = 'Update';

		switch (action) {
			case Action.AddTodo:
				actionLabel = 'Create';
			case Action.UpdateTodo:
				const selectedTodo =
					TodoListStorage.getActiveProject().todos[uuid] ?? null;
				modal = Modal.getTodoForm(
					executeAction,
					actionLabel,
					selectedTodo,
					args
				);
				break;
			case Action.AddProject:
				actionLabel = 'Create';
			case Action.UpdateProject:
				const selectedProject = TodoListStorage.get()[uuid] ?? null;
				modal = Modal.getProjectForm(
					executeAction,
					actionLabel,
					selectedProject,
					args
				);
				break;
			default:
				return;
		}

		container.appendChild(modal);
	};

	const toggleSidebar = () => {
		const menuIcon = document.querySelector('#menuIcon');
		const menuIconStyles = window.getComputedStyle(menuIcon);

		if (menuIconStyles.display === 'none') {
			return;
		}

		const menuIconImg = menuIcon.querySelector('img');
		const sidebarContainer = document.querySelector('#sidebarContainer');
		sidebarContainer?.classList.toggle('sidebar-display');
		menuIconImg.src = sidebarContainer?.classList.contains(
			'sidebar-display'
		)
			? menuIconClosed
			: menuIconOpen;
	};

	return {
		executeAction,
		showModal,
		toggleSidebar,
	};
})();
