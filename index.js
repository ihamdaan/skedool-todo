//Parent Object for browser is windows whereas for DOM is document


//Accessing the parent of the card i.e., row to add further cards in it
const taskContainer = document.querySelector(".task__container");


//global storage array to store the data fo all the cards present in DOM
let globalStorage = [];

//function to generate a new card on being called
const generateNewCard = (taskData) => `
<div class="col-md-6 col-lg-4 mb-5" id=${taskData.id}>
    <div class="card text-center shadow">
        <div class="card-header d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-outline-success" id=${taskData.id} onclick="editCard.apply(this, arguments)">
                <i class="far fa-edit" id=${taskData.id} onclick="editCard.apply(this, arguments)"></i>
            </button>
            <button type="button" class="btn btn-outline-danger" id=${taskData.id} onclick="deleteCard.apply(this, arguments)" >
                <i class="fas fa-trash-alt" id=${taskData.id} onclick="deleteCard.apply(this, arguments)"></i>
            </button>
        </div>
        <img src=${taskData.imageUrl} class="card-img-top" alt="Image">
        <div class="card-body">
            <h5 class="card-title">${taskData.taskTitle}</h5>
            <p class="card-text">
                ${taskData.taskDescription}
            </p>
            <button class="btn__title">${taskData.taskType}</button>
        </div>
        <div class="card-footer">
            <button type="button" class="btn__open float-end" id=${taskData.id}>
                <i class="fas fa-book-reader"></i> Open Task
            </button>
        </div>
    </div>
</div>
`;

//Making the card to stay on the web page after being reloaded, from the local storage
const loadInitialCardData = () => {
    //localstorage to get skedool data
    const getCardData = localStorage.getItem("skedool");

    //converting from string to normal JS object
    const {cards} = JSON.parse(getCardData);

    //loop over the array to create a HTML card
    cards.map((cardObject) => {
        //inject it to DOM
        taskContainer.insertAdjacentHTML("afterbegin", generateNewCard(cardObject));
        
        //update our global storage array
        globalStorage.push(cardObject);
    })
};

//Saving the changes in the card
const saveChanges = () => {
    const taskData = {
        id: `${Date.now()}`, //unique number for id
        imageUrl: document.getElementById("imageurl").value,
        taskTitle: document.getElementById("tasktitle").value,
        taskType: document.getElementById("tasktype").value,
        taskDescription: document.getElementById("taskdescription").value,
    };
    

    taskContainer.insertAdjacentHTML("afterbegin", generateNewCard(taskData));

    globalStorage.push(taskData);

    localStorage.setItem("skedool", JSON.stringify({cards:globalStorage}));
};


//deleting a card 
const deleteCard = (event) => {
    event = window.event;
    
    //id
    const targetID = event.target.id;
    const tagname = event.target.tagName;

    //match the id of the element in global storage array
    //if match found, remove it
    const newUpdatedArray = globalStorage.filter((cardObject) => cardObject.id !== targetID);
    //update the global storage array
    globalStorage = newUpdatedArray;
    //update the local storage in the browser about the deleted card
    localStorage.setItem("skedool", JSON.stringify({cards:globalStorage}));

    //contact parent

    //if the button is clicked
    if (tagname === "BUTTON"){
        return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode);
    }
    //if the icon is clicked
    else{
        return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode.parentNode);
    }
};


//contenteditable, editing the existing card
const editCard = (event) =>{
    event = window.event;
    
    //id
    const targetID = event.target.id;
    const tagname = event.target.tagName;

    let parentElement;

    if(tagname === "BUTTON"){
        parentElement = event.target.parentNode.parentNode;
    }
    else{
        parentElement = event.target.parentNode.parentNode.parentNode;
    }

    let taskTitle = parentElement.childNodes[5].childNodes[1];
    let taskDescription = parentElement.childNodes[5].childNodes[3];
    let taskType = parentElement.childNodes[5].childNodes[5];
    let submitButton = parentElement.childNodes[7].childNodes[1];

    //setting attributes
    taskTitle.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");
    submitButton.setAttribute("onclick", "saveEditChanges.apply(this, arguments)");
    submitButton.innerHTML = "Save Changes";
};

const saveEditChanges = (event) => {
    event = window.event;
    
    //id
    const targetID = event.target.id;
    const tagname = event.target.tagName;

    let parentElement;

    if(tagname === "BUTTON"){
        parentElement = event.target.parentNode.parentNode;
    }
    else{
        parentElement = event.target.parentNode.parentNode.parentNode;
    }

    let taskTitle = parentElement.childNodes[5].childNodes[1];
    let taskDescription = parentElement.childNodes[5].childNodes[3];
    let taskType = parentElement.childNodes[5].childNodes[5];
    let submitButton = parentElement.childNodes[7].childNodes[1];

    const updatedData = {
        taskTitle: taskTitle.innerHTML,
        taskType: taskType.innerHTML,
        taskDescription: taskDescription.innerHTML,
    };

    globalStorage = globalStorage.map((task) => {
        if (task.id === targetID){
            return {
                id: task.id,
                imageUrl: task.imageUrl,
                taskTitle: updatedData.taskTitle,
                taskType: updatedData.taskType,
                taskDescription: updatedData.taskDescription,
            };
        }
        return task;
    });

    //update the local storage in the browser about the deleted card
    localStorage.setItem("skedool", JSON.stringify({cards:globalStorage}));


    taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");
    submitButton.removeAttribute("onclick");
    submitButton.innerHTML = `<i class="fas fa-book-reader"></i> Open Task`;
};