
//checking if there is data present in local storage
if(!localStorage.getItem("allTickets")){

    //data is not present
    localStorage.setItem("allTickets", JSON.stringify([]));
} else{
    
    //data is present
    let allTickets = JSON.parse(localStorage.getItem("allTickets"));
    for(let i = 0; i < allTickets.length; i++){
        
        //retriving data of a single ticket
        let ticketObj = allTickets[i];
        let ticketId = ticketObj["ticketId"];
        let ticketColor = ticketObj["ticketColor"];
        let ticketText = ticketObj["ticketText"];

        //calling makeTicket function to make ticket dynamically
        makeTicket(ticketId, ticketColor, ticketText);
    }
}

//function to make ticket dynamically
function makeTicket(ticketId, ticketColor, ticketText){
    let ticketDiv = document.createElement("div");
    ticketDiv.classList.add("ticket");
    ticketDiv.innerHTML = `<div id="${ticketId}" class="ticket-header ${ticketColor}"></div>
    <div class="ticket-content">
        <div class="ticket-info">
        <div class="ticket-id">${ticketId}</div>
        <div class="ticket-delete"><i id="${ticketId}" class="fas fa-trash ${ticketColor}"></i></div>
        </div>
        <div class="ticket-text">${ticketText}</div>
    </div>`;

    //calling function ticketAppendToUi to append ticket to tickets-content
    ticketAppendToUi(ticketDiv);
}

//function to append ticket in tickets-content
function ticketAppendToUi(ticketDiv){

    //adding event on a ticket to change ticket header color
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

    //delete a single ticket
    ticketDiv.querySelector(".ticket-delete").addEventListener("click", function(e){

        //remove ticket from local storage
        let ticketDeleteId = e.target.id;
        let allTickets = JSON.parse(localStorage.getItem("allTickets"));
        let allTicketsFiltered = allTickets.filter(function(obj){
            return obj.ticketId != ticketDeleteId;
        })
        localStorage.setItem("allTickets", JSON.stringify(allTicketsFiltered));

        //remove ticket from ui
        ticketDiv.remove();
    })

    //appending ticket to tickets-content
    let ticketsContent = document.querySelector(".tickets-content");
    ticketsContent.append(ticketDiv);
}


