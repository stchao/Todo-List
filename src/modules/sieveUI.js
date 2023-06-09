import sortBoolAsc from '../images/sort-bool-asc.png';
import sortBoolDesc from '../images/sort-bool-desc.png';
import sortAlphaAsc from '../images/sort-alpha-asc.png';
import sortAlphaDesc from '../images/sort-alpha-desc.png';
import sortCalAsc from '../images/sort-cal-asc.png';
import sortCalDesc from '../images/sort-cal-desc.png';
import sortClockAsc from '../images/sort-clock-asc.png';
import sortClockDesc from '../images/sort-clock-desc.png';
import search from '../images/search.png';
import { Action, UIActions } from './uiActions';

const _getSelect = () => {
	const selectContainer = document.createDocumentFragment();
	const label = document.createElement('label');
	const select = document.createElement('select');

	label.textContent = 'Sort By';
	label.for = 'sortBySelect';
	select.id = 'sortBySelect';

	for (const action in SortAction) {
		const option = document.createElement('option');
		option.textContent = SortAction[action];
		option.value = SortAction[action];
		select.appendChild(option);
	}

	select.addEventListener('change', (ev) => {
		UIActions.executeAction({
			action: Action.UpdateSort,
			sortAction: ev.target.value,
		});
	});
	selectContainer.append(label, select);
	return selectContainer;
};

const _getFilterInput = (action) => {
	const filter = document.createElement('input');
	filter.placeholder = 'Begin typing to filter';
	filter.type = 'text';
	filter.addEventListener('input', (ev) => {
		setTimeout(UIActions.executeAction, 250, {
			action: action,
			filterText: ev.target.value,
			filterInput: ev.target,
		});
	});
	return filter;
};

export const getTodoSieveElements = () => {
	const sieveElements = document.createDocumentFragment();
	const filterContainer = getFilterContainer(Action.RunTodoFilter);
	const sortContainer = document.createElement('div');
	const select = _getSelect();
	const sortIcon = getSortIcon(SortAction.SortByCompleted);

	filterContainer.id = 'todoFilterContainer';
	filterContainer.classList.add('flex-center-center');
	sortContainer.id = 'sortContainer';
	sortContainer.classList.add('flex-center-center');
	sortContainer.append(select, sortIcon);
	sieveElements.append(sortContainer, filterContainer);
	return sieveElements;
};

export const getFilterContainer = (action) => {
	const filterContainer = document.createElement('div');
	const filterInput = _getFilterInput(action);
	const filterIcon = document.createElement('img');

	filterIcon.src = search;
	filterIcon.classList.add('icon');
	filterContainer.append(filterIcon, filterInput);

	return filterContainer;
};

export const SortAction = {
	SortByCompleted: 'Completed',
	SortByTitle: 'Title',
	SortByDescription: 'Description',
	SortByDueDate: 'Due Date',
	SortByPriority: 'Priority',
	SortByLastModified: 'Last Modified',
};

export const getSortIcon = (sortAction, isAscending = true) => {
	const icon = document.createElement('a');
	const imgIcon = document.createElement('img');
	let selector = 'div.todo-content';
	imgIcon.classList.add('icon');
	imgIcon.dataset.sortDirection = isAscending ? 'ASC' : 'DESC';
	imgIcon.title = isAscending ? 'Ascending' : 'Descending';

	switch (sortAction) {
		case SortAction.SortByCompleted:
			selector = 'button';
			imgIcon.src = isAscending ? sortBoolAsc : sortBoolDesc;
			break;
		case SortAction.SortByTitle:
			selector = 'button';
		case SortAction.SortByDescription:
		case SortAction.SortByPriority:
			imgIcon.src = isAscending ? sortAlphaAsc : sortAlphaDesc;
			break;
		case SortAction.SortByDueDate:
			selector = 'button';
			imgIcon.src = isAscending ? sortCalAsc : sortCalDesc;
			break;
		case SortAction.SortByLastModified:
			imgIcon.src = isAscending ? sortClockAsc : sortClockDesc;
			break;
		default:
			return;
	}

	icon.addEventListener('click', () => {
		UIActions.executeAction({
			action: Action.RunTodoSort,
			sortAction,
			isAscending,
			selector,
		});
		UIActions.executeAction({
			action: Action.UpdateSort,
			sortAction,
			isAscending: !isAscending,
		});
	});
	icon.append(imgIcon);
	icon.id = 'sortIcon';
	return icon;
};
