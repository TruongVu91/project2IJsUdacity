// Immutable state object
let store = Immutable.Map({
    user: Immutable.Map({ name: 'Student' }),
    roverDetail: '',
    rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
})

// add our markup to the page
const root = document.getElementById('root')

const roverName = document.getElementById('rover')
const btnShow = document.getElementById('btnShow')

btnShow.addEventListener('click', (event) => {
    event.preventDefault();
    getImageOfRover(roverName.value, store);
})

const updateStore = (state, newState) => {
    store = state.merge(newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

// create content
const App = (state) => {
    let roverDetail = state.get('roverDetail')

    if(roverDetail == undefined || roverDetail == "") {
        return `<p>Please select a rover</p>`
    } else {
        return `
            <section class="info">
                <h3>
                    INFORMATION
                </h3>
                ${generateInfo(roverDetail)}
            </section>
            <section class="image">
                <h3>
                    IMAGE GALLERY
                </h3>
                ${generateImage(roverDetail)}
            </section>
    `
    }
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders infomation requested from the backend
const generateInfo = (roverDetail) => {
    console.log(roverDetail)
    const detailInfo = Object.values(roverDetail)[0]
    if(roverDetail == undefined) {
        return (`
            <p>No Information</p>
        `)
    } else {
        return (`
            <p> + Name: ${detailInfo.photos[0].rover.name}</p>
            <p> + Launch date: ${detailInfo.photos[0].rover.launch_date}</p>
            <p> + Landing date: ${detailInfo.photos[0].rover.landing_date}</p>
            <p> + Status: ${detailInfo.photos[0].rover.status}</p>
        `)
    }
}

// Pure function that renders infomation requested from the backend
const generateImage = (roverDetail) => {
    console.log(roverDetail)
    const imageList = Object.values(roverDetail)[0].photos.map(item => {
        return (`
            <div class="gallery">
                <img src="${item.img_src}" />
            </div>
        `)
    })
    console.log(imageList)
    return imageList.join("")
}

// ------------------------------------------------------  API CALLS

const getImageOfRover= async (roverName, state) => {
    let {roverDetail} = state
    await fetch(`http://localhost:3000/${roverName}`)
        .then(res => res.json())
        .then(roverDetail => updateStore(store, { roverDetail }))
}
