//Need: State inculding an array of party objects
const state = {
    parties: []
}

//Query selectors for ul id partyList
const partyDisplay =  document.querySelector('#partyList')


//Function calls
initRender()

// Inital render function to await getEvents before rendering
async function initRender() {
    await getEvents()
    render()
}

// Render function to display party objects in ul
function render () {
    const partyEls = state.parties.map((partyObj) => {
        const artistEl = document.createElement('li')

        //partyObj keys are name, location, description, date (includes date and time 'yyyy-mm-ddThh:mm:ss:mmmz'), and id
        const name = document.createElement('h3')
        name.textContent = partyObj.name

        const date = document.createElement('p')
        date.textContent = getDateStr(partyObj.date)
        

        const location = document.createElement('p')
        location.textContent = `Location: ${partyObj.location}`

        const description = document.createElement('p')
        description.textContent = partyObj.description

        const deleteBtn = document.createElement('button')
        deleteBtn.textContent = 'Delete'
        
        deleteBtn.addEventListener('click', deleteEvent)

        artistEl.replaceChildren(name, date, location, description, deleteBtn)

        return artistEl
    })

    partyDisplay.replaceChildren(...partyEls)
}

//Async function to pull /events from https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-GHP-ET-WEB-FT-SF/events
async function getEvents() {
    try {
        const response = await fetch('https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-GHP-ET-WEB-FT-SF/events')
        const responseObj = await response.json()

        state.parties = responseObj.data
    } catch (error) {
        console.log(error)
    }
}

//function to parse date and time to be more readable
function getDateStr(inputStr) {
    //inputStr in the format 2023-08-20T23:40:08.000Z
    let date = inputStr.slice(0, 10)
    let time = inputStr.slice(11, 19)

    return `Date: ${date} Time: ${time}`
}

function deleteEvent(e) {
    e.preventDefault()

    const partyToDeleteNameDisplay = e.target.parentElement.firstChild

    const partyToDelete = state.parties.find((partyObj, index) => {
        if (partyObj.name === partyToDeleteNameDisplay.textContent){
            state.parties.splice(index, 1)
            return true
        }
        })

    console.log(partyToDelete)

    render()
}