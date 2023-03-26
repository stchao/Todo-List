import { Storage } from "./storage";
import editIcon from "../images/pencil.png";
import deleteIcon from "../images/delete.png";

export const UI = (() => {
    const _setActiveProject = (ev, projectUuid) => {
        let targetElement = ev.target;
        while (!targetElement.id && targetElement.tagName !== 'BUTTON') {
            targetElement = targetElement.parentElement;
        }
    
        if (targetElement.parentElement.id !== 'projectList' || ev.target.tagName === 'IMG') {
            return;
        }
    
        Storage.setActiveProject(projectUuid);
        const siblings = [...targetElement.parentElement.children];
        siblings.forEach((sibling) => sibling.classList.remove('active'));
        targetElement.classList.add('active');
        setTodoUI();
    }

    const setProjectUI = () => {
        const currentStorage = Storage.get();
        const currentProject = Storage.getActiveProject(true);
        const projectFragment = document.createDocumentFragment();    
    
        for (const projectUuid in currentStorage) {           
            const projectButtonElement = document.createElement('button');
            projectButtonElement.classList.add('project-button', 'project-font');
            
            const projectTitleElement = document.createElement('span');
            projectTitleElement.innerText = currentStorage[projectUuid].title;
            projectTitleElement.classList.add('button-text');
            projectButtonElement.appendChild(projectTitleElement);

            const editProjectElement = UI.getClickableIconElement(editIcon);
            editProjectElement.addEventListener('click', () => { toggleModal('update-project', projectUuid); });
    
            const deleteProjectElement = UI.getClickableIconElement(deleteIcon);
            deleteProjectElement.addEventListener('click', () => 
            { Storage.removeProject(projectUuid); projectButtonElement.remove(); });

            if (currentProject === projectUuid) {
                projectButtonElement.classList.add('active');
            }

            if (currentStorage[projectUuid].title !== 'Default') {
                projectButtonElement.appendChild(editProjectElement);
                projectButtonElement.appendChild(deleteProjectElement);
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
        const todoElements = createTodoElements(currentProject?.todos);
    
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

    const getClickableIconElement = (imgSrc) => {
        const anchorElement = document.createElement('a');
        const imgIcon = document.createElement('img');
        imgIcon.src = imgSrc;
        imgIcon.classList.add('icon');
        anchorElement.appendChild(imgIcon);
        return anchorElement;
    }

    return { setProjectUI, setTodoUI, getAddButtonElement, getClickableIconElement } 
})();

const createTodoElements = (todos) => {
    const todosFragment = document.createDocumentFragment();    

    for (const todoUuid in todos) {       
        const todoDetails = document.createElement('ul');
        for (const todoProperty in todos[todoUuid]) {
            if (todoProperty === 'uuid') {
                continue;
            }

            const todoDetail = document.createElement('li');
            todoDetail.innerText = `${todoProperty}: ${todos[todoUuid][todoProperty]}`;
            todoDetails.appendChild(todoDetail);
        }

        const todoContent = document.createElement('div');
        todoContent.classList.add('todo-content', 'hidden-todo-content');
        todoContent.appendChild(todoDetails);
        
        const todoButton = document.createElement('button');
        todoButton.type = 'button';
        todoButton.classList.add('collapsible', 'todo-font');
        todoButton.addEventListener('click', (ev) => { toggleContent(ev, todoContent); });

        const completedElement = document.createElement('input');
        completedElement.type = 'checkbox'
        completedElement.checked = todos[todoUuid].isCompleted;

        const todoTitleElement = document.createElement('span');
        todoTitleElement.innerText = todos[todoUuid].Title;
        todoTitleElement.classList.add('button-text');

        const editTodoElement = UI.getClickableIconElement(editIcon);
        editTodoElement.addEventListener('click', () => { toggleModal('update-todo', todoUuid); });

        const deleteTodoElement = UI.getClickableIconElement(deleteIcon);
        deleteTodoElement.addEventListener('click', () => { 
            Storage.removeTodo(todoUuid); todoButton.remove(); todoContent.remove(); 
        });

        const dueDateElement = document.createElement('span');
        dueDateElement.innerText = `Due: ${todos[todoUuid]['Due Date']}`;        

        const todoActionContainer = document.createElement('div');
        todoActionContainer.classList.add('todo-action-container');
        todoActionContainer.appendChild(editTodoElement);
        todoActionContainer.appendChild(deleteTodoElement);
        todoActionContainer.appendChild(dueDateElement);

        todoButton.appendChild(completedElement);
        todoButton.appendChild(todoTitleElement);
        todoButton.appendChild(todoActionContainer);
        todosFragment.appendChild(todoButton);
        todosFragment.appendChild(todoContent);
    }

    return todosFragment;
}

const toggleContent = (ev, contentElement) => {
    let targetElement = ev.target;
    while (!targetElement.id && targetElement.tagName !== 'BUTTON') {
        targetElement = targetElement.parentElement;
    }

    if (targetElement.id || ev.target.tagName === 'IMG' || !contentElement) {
        return;
    }

    targetElement.classList.toggle('active');

    if (contentElement.style.maxHeight) {
        contentElement.style.maxHeight = null;
        contentElement.classList.add('hidden-todo-content');
    } else {
        contentElement.style.maxHeight = contentElement.scrollHeight + "px";
        contentElement.classList.remove('hidden-todo-content');
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

const getTodoModalElements = (selectedTodo = null) => {
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

    if (selectedTodo) {
        descriptionRowAttributes.value = selectedTodo.Description;
        dueDateRowAttributes.value = selectedTodo['Due Date'];
        priorityRowAttributes.value = selectedTodo.Priority;
        isCompletedRowAttributes.value = selectedTodo.isCompleted;
    }

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

const getAllModalElements = (classToAdd, uuid = '') => {
    let selectedProject = null;
    let selectedTodo = null;

    if (uuid) {
        selectedProject = Storage.get()[uuid] ?? null;
        selectedTodo = Storage.getActiveProject().todos[uuid] ?? null;
    }

    const modalFragment = document.createDocumentFragment();
    const titleRowAttributes = {
        id: 'titleInput',
        name: 'title',
        type: 'text',
        minlength: 1,
        maxlength: 200,
        value: selectedProject?.title || selectedTodo?.Title || '',
    };   

    const titleItem = formItemFactory('TITLE:', titleRowAttributes, true);
    const titleRowElement = getFormRow(titleItem);
    modalFragment.appendChild(titleRowElement);

    if (classToAdd.indexOf('-todo') > -1) {
        const todoModalElements = getTodoModalElements(selectedTodo);
        modalFragment.appendChild(todoModalElements);
    }

    return modalFragment;
}

const getModals = (classToAdd, uuid = '') => {  
    const modalElement = document.createElement('div');
    const formElement = document.createElement('form');
    const closeModalButton = document.createElement('button');
    const allModalElements = getAllModalElements(classToAdd, uuid);
    const createButton = document.createElement('button');
    
    closeModalButton.type = 'button';
    closeModalButton.classList.add('close-form-button');
    closeModalButton.innerText = 'x';
    closeModalButton.addEventListener('click', () => { toggleModal(); });

    createButton.type = 'button';
    createButton.innerText = uuid ? 'Update' : 'Create';
    createButton.addEventListener('click', () => { createUpdateEntry(classToAdd, uuid); });

    modalElement.id = 'modal';
    modalElement.classList.add(classToAdd);

    formElement.appendChild(closeModalButton);
    formElement.appendChild(allModalElements);
    formElement.appendChild(createButton);
    modalElement.appendChild(formElement);

    return modalElement;
}

const toggleModal = (classToAdd = '', uuid = '') => {
    if (classToAdd) {
        const modalElement = getModals(classToAdd, uuid);
        modalElement.classList.add(classToAdd);

        const containerElement = document.querySelector('#container');
        containerElement.appendChild(modalElement);

        return;
    }    

    const modalElement = document.querySelector('#modal');
    modalElement.remove();
}

const createUpdateEntry = (classToAdd, uuid = '') => {
    const currentProject = Storage.getActiveProject();
    const titleElement = document.querySelector('#titleInput');
    const descriptionElement = document.querySelector('#todoDescriptionInput');
    const dueDateElement = document.querySelector('#todoDueDateInput');
    const priorityElement = document.querySelector('#todoPriorityInput');
    const isCompletedElement = document.querySelector('#todoIsCompletedCheckbox');

    switch (classToAdd) {
        case 'new-todo':           
            const tempTodo = Storage.addTodo();
            tempTodo.Title = titleElement.value;
            tempTodo.Description = descriptionElement.value;
            tempTodo['Due Date'] = dueDateElement.value;
            tempTodo.Priority = priorityElement.value;
            tempTodo.isCompleted = isCompletedElement.checked;

            Storage.updateTodo(tempTodo);            
            break;
        case 'update-todo':
            const currentTodo = currentProject.todos[uuid];
            currentTodo.Title = titleElement.value;
            currentTodo.Description = descriptionElement.value;
            currentTodo['Due Date'] = dueDateElement.value;
            currentTodo.Priority = priorityElement.value;
            currentTodo.isCompleted = isCompletedElement.checked;
            currentTodo['Last Modified Date'] = new Date();

            Storage.updateTodo(currentTodo);
            break;
        case 'new-project':
            const tempProject = Storage.addProject();
            tempProject.title = titleElement.value;
            Storage.updateProjectTitle(tempProject);
            break;
        case 'update-project':
            const selectedProject = Storage.get()[uuid];
            selectedProject.title = titleElement.value;
            Storage.updateProjectTitle(selectedProject);
            break;
        default:
            break;
    }

    UI.setProjectUI();
    UI.setTodoUI();    
    toggleModal();
}