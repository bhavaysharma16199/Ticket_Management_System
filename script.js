let allFilters = {
    red : "#f53b57",
    blue: "#25CCF7",
    yellow: "#f9ca24",
    green: "#2ecc71"
};

let filters = document.querySelectorAll(".filter");
let ticketsContent = document.querySelector(".tickets-content");

// function to make background according to the filter colour
for(let i = 0; i < filters.length; i++){
    filters[i].addEventListener("click", function(e){
        let filterSelected = e.target.classList[1];
        if(e.target.classList.contains("active-filter")){
            e.target.classList.remove("active-filter");
            let allTickets = JSON.parse(localStorage.getItem("allTickets"));
            ticketsContent.innerHTML = "";
            for(let j = 0; j < allTickets.length; j++){
                let ticketObj = allTickets[j];
                let ticketId = ticketObj["ticketId"];
                let ticketColor = ticketObj["ticketColor"];
                let ticketText = ticketObj["ticketText"];
                makeTicket(ticketId, ticketColor, ticketText);
            }

        } else{
            if(document.querySelector(".active-filter.filter")){
                document.querySelector(".active-filter.filter").classList.remove("active-filter");
            }
            filters[i].classList.add("active-filter");
            sortTickets(filterSelected);
        }
    })
}

function sortTickets(filterSelected){
    let allTickets = JSON.parse(localStorage.getItem("allTickets"));
    let filteredTickets = allTickets.filter(function(obj){
        return obj.ticketColor == filterSelected;
    })

    ticketsContent.innerHTML = "";
    
    for(let i = 0 ; i < filteredTickets.length; i++){
        let ticketObj = filteredTickets[i];
        let ticketId = ticketObj["ticketId"];
        let ticketColor = ticketObj["ticketColor"];
        let ticketText = ticketObj["ticketText"];
        makeTicket(ticketId, ticketColor, ticketText);
    }
}

//open modal function
let openModal = document.querySelector(".open-modal");
openModal.addEventListener("click", function(e){

    //if modal is already open
    if(document.querySelector(".modal")){
        return;
    }

    //creating modal dynamically
    let modalDiv = document.createElement("div");
    modalDiv.classList.add("modal");
    modalDiv.innerHTML = `<div class="modal-text" contenteditable="true" spellcheck="false" data-clicked = "false" data-typed = "false">Enter your text here</div>
    <div class="modal-filters">
        <div class="modal-filter red"></div>
        <div class="modal-filter blue"></div>
        <div class="modal-filter yellow"></div>
        <div class="modal-filter green active-filter"></div>
    </div>`
    ticketsContent.append(modalDiv);
    
    //modal text remove after clicking it.
    let modalText = document.querySelector(".modal-text");
    modalText.addEventListener("click", function(e){
        if(modalText.getAttribute("data-clicked") == "false"){
            modalText.setAttribute("data-clicked", "true");
            e.target.innerText = "";
        }
    })

    //key pressed in modal except enter
    modalText.addEventListener("keypress", function(e){
        if(e.key != "Enter"){
            if(modalText.getAttribute("data-typed") == "false"){
                modalText.setAttribute("data-typed", "true");
            }
        }
    })

    //click on modal filters
    let modalFilters = document.querySelectorAll(".modal-filter");
    for(let i = 0; i < modalFilters.length; i++){
        modalFilters[i].addEventListener("click", function(e){

            //remove active-filter class from modal filter
            if(document.querySelector(".active-filter.modal-filter")){
                let activeFilter = document.querySelector(".active-filter.modal-filter");
                activeFilter.classList.remove("active-filter");
            }

            //add active-filter class to clicked modal filter
            if(!modalFilters[i].classList.contains("active-filter")){
                modalFilters[i].classList.add("active-filter");
            }
        })
    }

    //press enter on modal
    document.querySelector(".modal-text").addEventListener("keypress", function(e){
        if(e.key == "Enter" && modalText.getAttribute("data-typed") == "true"){
            let activeFilterColor = document.querySelector(".active-filter.modal-filter").classList[1];
            let modalTextInput = document.querySelector(".modal-text").innerText;

            //calling function to append a single ticket in tickets-content
            appendTicket(activeFilterColor, modalTextInput);
        }
    })
})

//function to append tickets
function appendTicket(activeFilterColor, modalTextInput){

    //calling uid to get unique ticket number
    let ticketHeaderId = uid();

    //making a ticket dynamically
    let ticketDiv = document.createElement("div");
    ticketDiv.classList.add("ticket");
    ticketDiv.innerHTML = `<div id="${ticketHeaderId}" class="ticket-header ${activeFilterColor}"></div>
    <div class="ticket-content">
        <div class="ticket-info">
        <div class="ticket-id">${ticketHeaderId}</div>
        <div class="ticket-delete"><i id="${ticketHeaderId}" class="fas fa-trash ${activeFilterColor}"></i></div>
        </div>
        <div class="ticket-text">${modalTextInput}</div>
    </div>`;

    //change ticket header color 
    ticketDiv.querySelector(".ticket-header").addEventListener("click", function(e){
        let ticketFilters = ["red", "blue", "yellow", "green"];
        let currentFilter = e.target.classList[1];
        let idx = ticketFilters.indexOf(currentFilter);
        idx++;
        idx = idx % 4;
        e.target.classList.remove(currentFilter);
        e.target.classList.add(ticketFilters[idx]);

        //change color of delete icon with ticket header
        ticketDiv.querySelector(".fas").classList.remove(currentFilter);
        ticketDiv.querySelector(".fas").classList.add(ticketFilters[idx]);
        

        //change ticket header color and apply it to the local storage. 
        let HeaderId = e.target.id;
        let allTickets = JSON.parse(localStorage.getItem("allTickets"));
        let myObj = allTickets.filter(function(obj){
            return (obj.ticketId == HeaderId)
        })
        let updatedObj = {ticketId: HeaderId, ticketText: myObj[0].ticketText , ticketColor: ticketFilters[idx]};
        let idxObj = allTickets.indexOf(myObj[0]);
        allTickets[idxObj] = updatedObj;
        localStorage.setItem("allTickets", JSON.stringify(allTickets));
    })    

    //adding ticket to tickets-content
    ticketsContent.append(ticketDiv);

    //storing info of a ticket in an object
    let ticketObj = {
        "ticketId": ticketHeaderId,
        "ticketText": modalTextInput,
        "ticketColor": activeFilterColor
    }

    //adding object of a ticket to local storage
    let allTickets = JSON.parse(localStorage.getItem("allTickets"));
    allTickets.push(ticketObj);
    localStorage.setItem("allTickets", JSON.stringify(allTickets));

    //delete a single ticket
    ticketDiv.querySelector(".ticket-delete").addEventListener("click", function(e){

        //remove ticket from local storage
        let ticketDeleteId = e.target.id;
        let allTickets = JSON.parse(localStorage.getItem("allTickets"));
        let allTicketsFiltered = allTickets.filter(function(obj){
            return obj.ticketId != ticketDeleteId;
        })
        console.log(allTicketsFiltered);
        localStorage.setItem("allTickets", JSON.stringify(allTicketsFiltered));
        
        //remove ticket from ui
        ticketDiv.remove();
    })

    //calling close modal function
    closeModal();
}



//close modal button
document.querySelector(".close-modal").addEventListener("click", function(e){
    if(document.querySelector(".modal")){
        closeModal();
    }
})

//close modal function
function closeModal(){
    document.querySelector(".modal").remove();
}
