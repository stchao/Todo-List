import { Storage } from "./storage";

export const updateProjectUI = () => {
    const currentStorage = Storage.get();
    const projectFragment = document.createDocumentFragment();    

    for (const projectUuid in currentStorage) {
        const projectElement = createProjectElement(currentStorage[projectUuid]);
        const todoElements = createTodoElements(currentStorage[projectUuid].todos);
        projectFragment.appendChild(projectElement);
        projectFragment.appendChild(todoElements);
    }

    const projectListElement = document.querySelector('#projectList');   
    projectListElement.textContent = '';
    projectListElement.appendChild(projectFragment);
}

export const updateTodoUI = () => {
    const currentTodos = Storage.getActiveProjectTodos();  
    const todoElements = createTodoElements(currentTodos);

    const todos = document.querySelector('#todosContainer');   
    todos.textContent = '';
    todos.appendChild(todoElements);
}

export const getAddButtonElement = (classToAdd) => {
    const addButtonElement = document.createElement('button');
    addButtonElement.addEventListener('click', () => { toggleModal(classToAdd); });
    return addButtonElement;
}

const createProjectElement = (currentProject) => {
    const projectItemElement = document.createElement('li');
    projectItemElement.innerText = currentProject.title;
    return projectItemElement;
}

const createTodoElements = (todos) => {
    const todosElement = document.createElement('ul');

    for (const todoUuid in todos) {
        const todoElement = document.createElement('li');
        todoElement.innerText = todos[todoUuid].title;
        todosElement.appendChild(todoElement);
    }

    return todosElement;
}

const formItemFactory = (label, attributes, isRequired = false) => {
    return { label, attributes, isRequired };
}

const getFormRow = (formItem) => {
    const rowElement = document.createElement('div');
    const labelElement = document.createElement('label');
    const textElement = document.createElement('input');

    labelElement.innerText = formItem.label;
    labelElement.setAttribute('for', formItem.attributes.id);  

    for (const property in formItem.attributes) {
        textElement.setAttribute(property, formItem.attributes[property]);
    }

    if (formItem.isRequired) {
        const requiredSpan = document.createElement('span');
        requiredSpan.innerText = '*';
        requiredSpan.setAttribute('aria-label', 'required');

        labelElement.appendChild(requiredSpan);
        textElement.setAttribute('required', '');
    }

    if (formItem.attributes.type === 'date') {
        textElement.valueAsDate = new Date();
    }

    rowElement.appendChild(labelElement);
    rowElement.appendChild(textElement);
    rowElement.classList.add('form-row');

    return rowElement;
}

const getTodoModalElements = () => {
    const todoModalFragment = document.createDocumentFragment();

    const descriptionRowAttributes = {
        id: 'todoDescriptionInput',
        name: 'todo_description',
        type: 'text',
        minlength: 1,
        maxlength: 200,
    };

    const dueDateRowAttributes = {
        id: 'todoDueDateInput',
        name: 'todo_due_date',
        type: 'date',
    };

    const priorityRowAttributes = {
        id: 'todoPriorityInput',
        name: 'todo_description',
        type: 'number',
        title: 'Enter a number between -999 and 999',
        value: 0,
        max: 999,
        min: -999
    };
    
    const isCompletedRowAttributes = {
        id: 'todoIsCompletedCheckbox',
        name: 'todo_is_completed',
        type: 'checkbox',
    };

    const formItems = [
        formItemFactory('DESCRIPTION:', descriptionRowAttributes),
        formItemFactory('DUE DATE:', dueDateRowAttributes),
        formItemFactory('PRIORITY:', priorityRowAttributes),
        formItemFactory('IS COMPLETED?', isCompletedRowAttributes)
    ];

    formItems.forEach((formItem) => {
        const formItemContainer = getFormRow(formItem);
        formItemContainer.classList.add('new-todo');
        todoModalFragment.appendChild(formItemContainer);
    });

    return todoModalFragment;
}

const getAllModalElements = (classToAdd) => {
    const modalFragment = document.createDocumentFragment();
    const titleRowAttributes = {
        id: 'titleInput',
        name: 'title',
        type: 'text',
        minlength: 1,
        maxlength: 200,
    };

    const titleItem = formItemFactory('TITLE:', titleRowAttributes, true);
    const titleRowElement = getFormRow(titleItem);
    modalFragment.appendChild(titleRowElement);

    if (classToAdd === 'new-todo') {
        const todoModalElements = getTodoModalElements();
        modalFragment.appendChild(todoModalElements);
    }

    return modalFragment;
}

const getModals = (classToAdd) => {  
    const modalElement = document.createElement('div');
    const formElement = document.createElement('form');
    const closeModalButton = document.createElement('button');
    const allModalElements = getAllModalElements(classToAdd);
    const createButton = document.createElement('button');
    
    closeModalButton.type = 'button';
    closeModalButton.classList.add('close-form-button');
    closeModalButton.innerText = 'x';
    closeModalButton.addEventListener('click', () => { toggleModal(); });

    createButton.type = 'button';
    createButton.innerText = 'Create';
    createButton.addEventListener('click', () => { createEntry(classToAdd); });

    modalElement.id = 'modal';
    modalElement.classList.add(classToAdd);

    formElement.appendChild(closeModalButton);
    formElement.appendChild(allModalElements);
    formElement.appendChild(createButton);
    modalElement.appendChild(formElement);

    return modalElement;
}

const toggleModal = (classToAdd = '') => {
    if (classToAdd) {
        const modalElement = getModals(classToAdd);
        modalElement.classList.add(classToAdd);

        const containerElement = document.querySelector('#container');
        containerElement.appendChild(modalElement);

        return;
    }    

    const modalElement = document.querySelector('#modal');
    modalElement.remove();
}

const createEntry = (classToAdd) => {
    const titleElement = document.querySelector('#titleInput');

    switch (classToAdd) {
        case 'new-todo':
            const descriptionElement = document.querySelector('#todoDescriptionInput');
            const dueDateElement = document.querySelector('#todoDueDateInput');
            const priorityElement = document.querySelector('#todoPriorityInput');
            const isCompletedElement = document.querySelector('#todoIsCompletedCheckbox');

            const tempTodo = Storage.addTodo();
            tempTodo.title = titleElement.value;
            tempTodo.description = descriptionElement.value;
            tempTodo.dueDate = dueDateElement.value;
            tempTodo.priority = priorityElement.value;
            tempTodo.isCompleted = isCompletedElement.checked;

            Storage.updateTodo(tempTodo);            
            break;
        case 'new-project':
            const tempProject = Storage.addProject();
            tempProject.title = titleElement.value;
            Storage.updateProjectTitle(tempProject);
            break;
        default:
            break;
    }

    updateProjectUI();
    updateTodoUI();    
    toggleModal();
}