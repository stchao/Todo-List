export const createProjectElement = (currentProject) => {
    const projectItemElement = document.createElement('li');
    projectItemElement.innerText = currentProject.title;
    return projectItemElement;
}

export const createTodosElements = (currentProject) => {
    const todosElement = document.createElement('ul');

    for (const todoUuid in currentProject.todos) {
        const todoElement = document.createElement('li');
        todoElement.innerText = currentProject.todos[todoUuid].title;
        todosElement.appendChild(todoElement);
    }

    return todosElement;
}

export const createProject = (title = "default") => {

}

export const getModals = () => {
    const modalFragment = document.createDocumentFragment();
    const closeModalButton = document.createElement('button');
    const allModalElements = getAllModalElements();
    const todoModalElements = getTodoModalElements();
    const createButton = document.createElement('button');
    
    closeModalButton.type = 'button';
    closeModalButton.classList.add('close-form-button');
    closeModalButton.innerText = 'x';
    closeModalButton.addEventListener('click', () => { toggleModal(); });

    createButton.innerText = 'Create';
    createButton.type = 'button';    

    modalFragment.appendChild(closeModalButton);
    modalFragment.appendChild(allModalElements);
    modalFragment.appendChild(todoModalElements);
    modalFragment.appendChild(createButton);
    return modalFragment;
}

export const toggleModal = (classToAdd = '') => {
    const modalElement = document.querySelector('#modal');
    const classesToToggle = [ 'new-todo', 'new-project' ];

    modalElement.classList.toggle('d-none');
    classesToToggle.forEach((classToToggle) => {
        if (modalElement.classList.contains(classToToggle)) {
            modalElement.classList.toggle(classToToggle);
        }
    })

    if (classToAdd) {
        modalElement.classList.add(classToAdd);
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

const getAllModalElements = () => {
    const titleRowAttributes = {
        id: 'titleInput',
        name: 'title',
        type: 'text',
        minlength: 1,
        maxlength: 200,
    };

    const titleItem = formItemFactory('TITLE:', titleRowAttributes, true);
    const titleRowElement = getFormRow(titleItem);
    return titleRowElement;
}

const getTodoModalElements = () => {
    const todoModalFragment = document.createDocumentFragment();

    const descriptionRowAttributes = {
        id: 'todoDescription',
        name: 'todo_description',
        type: 'text',
        minlength: 1,
        maxlength: 200,
    };

    const dueDateRowAttributes = {
        id: 'todoDueDate',
        name: 'todo_due_date',
        type: 'date',
    };

    const priorityRowAttributes = {
        id: 'todoPriority',
        name: 'todo_description',
        type: 'number',
        title: 'Enter a number between -999 and 999',
        value: 0,
        max: 999,
        min: -999
    };
    
    const isCompletedRowAttributes = {
        id: 'todoIsCompleted',
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