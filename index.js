//Need: State inculding an array of party objects
const state = {
    parties: []
}

//Query selectors and global variable
const partyDisplay =  document.querySelector('#partyList')
const inputForm = document.querySelector('form')
const API = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-GHP-ET-WEB-FT-SF/events'

//Function calls
render()
inputForm.addEventListener('submit', addEvent)

// Render function to display party objects in ul
async function render () {
    await getEvents()
    
    const partyEls = state.parties.map((partyObj) => {
        const partyEl = document.createElement('li')

        //partyObj keys are name, location, description, date (includes date and time 'yyyy-mm-ddThh:mm:ss:mmmz'), and id
        const name = document.createElement('h3')
        name.textContent = partyObj.name

        const date = document.createElement('p')
        date.textContent = `Date: ${partyObj.date}`
        
        const time = document.createElement('p')
        time.textContent = `Time: ${partyObj.time}`

        const location = document.createElement('p')
        location.textContent = `Location: ${partyObj.location}`

        const description = document.createElement('p')
        description.textContent = partyObj.description

        const deleteBtn = document.createElement('button')
        deleteBtn.textContent = 'Delete'
        
        deleteBtn.addEventListener('click', () => deleteEvent(partyObj.id))

        const updateBtn = document.createElement('button')
        updateBtn.textContent = 'Update'
        
        updateBtn.addEventListener('click', () => updateEvent(partyObj.id))

        partyEl.replaceChildren(name, date, time, location, description, updateBtn, deleteBtn)

        return partyEl
    })

    partyDisplay.replaceChildren(...partyEls)
}

//Async function to pull /events from https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-GHP-ET-WEB-FT-SF/events
async function getEvents() {
    try {
        const response = await fetch(API)
        const responseObj = await response.json()

        state.parties = responseObj.data
        state.parties.forEach((partyObj) => {
            partyObj.time = parseDate(partyObj.date, 'time')
            partyObj.date = parseDate(partyObj.date, 'date')
        })
    } catch (error) {
        console.log(error)
    }
}

async function addEvent(e) {
    e.preventDefault()

    const date = formatDate(inputForm.date.value, inputForm.time.value)

    try {
        const response = await fetch(API, {
            method: 'Post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: inputForm.name.value,
                description: inputForm.description.value,
                date: date,
                location: inputForm.location.value
            })
        })

        if (!response.ok) {
            throw new Error('Failed to add event')
        }

        render()
    } catch (error) {
        console.log(error)
    }
}

async function deleteEvent(id) {
    try{
        const response = await fetch(`${API}/${id}`, {
            method: "DELETE",
        })

        if (!response.ok) {
            throw new Error("failed to delete event")
        }

        render()
    } catch (error) {
        console.log(error)
    }
}

async function updateEvent(id) {
    const party = state.parties.find((partyObj) => partyObj.id === id)
    
    for(let key in party) {
        let property = inputForm[key]
        if(!property) {
            continue
        }
        property = property.value
        if(property) {
            party[key] = property
        }
    }

    party.date = formatDate(party.date, party.time)
    delete party.time

    try {
        const response = await fetch(`${API}/${id}`, {
            method: 'Put',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(party)
        })

        if (!response.ok) {
            throw new Error('Failed to update event')
        }

        render()
    } catch (error) {
        console.log(error)
    }
}

//function to parse date and time for display
function parseDate(inputStr, expectedOutput) {
    //inputStr in the format 2023-08-20T23:40:08.000Z
    if (expectedOutput === 'date') {
        return inputStr.slice(0, 10)
    } else if (expectedOutput === 'time') {
        return inputStr.slice(11, 19)
    } else {
        return 'invalid expected Output'
    }
}

//function to format the input date and time into what the api accepts
function formatDate(date, time) {
    return date + 'T' + time + ':00.000Z'
}