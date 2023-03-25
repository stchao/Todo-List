import { Storage } from "./storage";
import editIcon from "../images/pencil.png";
import deleteIcon from "../images/delete.png";

export const UI = (() => {
    const _setActiveProject = (ev, projectUuid) => {
        Storage.setActiveProject(projectUuid);
        const siblings = [...ev.target.parentElement.children];
        siblings.forEach((sibling) => sibling.classList.remove('active'));
        ev.target.classList.add('active');
        setTodoUI();
    }

    const setProjectUI = () => {
        const currentStorage = Storage.get();
        const currentProject = Storage.getActiveProject(true);
        const projectFragment = document.createDocumentFragment();    
    
        for (const projectUuid in currentStorage) {
            const projectButtonElement = document.createElement('button');
            projectButtonElement.innerText = currentStorage[projectUuid].title;
            projectButtonElement.classList.add('add-button', 'project-font');

            if (currentProject === projectUuid) {
                projectButtonElement.classList.add('active');
            }

            projectButtonElement.addEventListener('click', (ev) => { _setActiveProject(ev, projectUuid) });
            projectFragment.appendChild(projectButtonElement);
        }
    
        const projectListElement = document.querySelector('#projectList');   
        projectListElement.textContent = '';
        projectListElement.appendChild(projectFragment);
    }

    const setTodoUI = () => {
        const currentProject = Storage.getActiveProject();  
        const todoElements = createTodoElements(currentProject.todos);
    
        const todos = document.querySelector('#todosContainer');   
        todos.textContent = '';
        todos.appendChild(todoElements);
    }

    const getAddButtonElement = (classToAdd) => {
        const addButtonElement = document.createElement('button');
        addButtonElement.classList.add('add-button');
        addButtonElement.addEventListener('click', () => { toggleModal(classToAdd); });
        return addButtonElement;
    }

    return { setProjectUI, setTodoUI, getAddButtonElement } 
})();

const createTodoElements = (todos) => {
    const todosFragment = document.createDocumentFragment();    

    for (const todoUuid in todos) {       
        const editTodoElement = document.createElement('a');
        const editImgIcon = document.createElement('img');
        editImgIcon.src = editIcon;
        editImgIcon.classList.add('icon');
        editTodoElement.appendChild(editImgIcon);        

        const deleteTodoElement = document.createElement('a');
        const deleteImgIcon = document.createElement('img');
        deleteImgIcon.src = deleteIcon;
        deleteImgIcon.classList.add('icon');
        deleteTodoElement.appendChild(deleteImgIcon);
        deleteTodoElement.addEventListener('click', () => { Storage.removeTodo(todoUuid); UI.setTodoUI(); });

        const todoButton = document.createElement('button');
        todoButton.type = 'button';
        todoButton.classList.add('collapsible', 'todo-font');
        todoButton.addEventListener('click', toggleContent);
        todoButton.innerText = todos[todoUuid].title;
        todoButton.appendChild(editTodoElement);
        todoButton.appendChild(deleteTodoElement);

        const todoDetails = document.createElement('ul');
        for (const todoProperty in todos[todoUuid]) {
            if (todoProperty === 'uuid') {
                continue;
            }

            const todoDetail = document.createElement('li');
            todoDetail.innerText = `${todoProperty.toUpperCase()}: ${todos[todoUuid][todoProperty]}`;
            todoDetails.appendChild(todoDetail);
        }

        const todoContent = document.createElement('div');
        todoContent.classList.add('todo-content');
        todoContent.appendChild(todoDetails);

        todosFragment.appendChild(todoButton);
        todosFragment.appendChild(todoContent);
    }

    return todosFragment;
}

const toggleContent = (ev) => {
    if (ev.target.tagName !== 'BUTTON') {
        return;
    }

    ev.target.classList.toggle('active');
    const content = ev.target.nextElementSibling;

    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        content.style.borderWidth = 0;
    }
    else {
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.borderWidth = '1.5px';
    }
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

    UI.setProjectUI();
    UI.setTodoUI();    
    toggleModal();
}