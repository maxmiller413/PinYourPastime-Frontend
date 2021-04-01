/*********************Global Variables**************************/
const loginDiv = document.querySelector('div#login-container')
const divMain = document.querySelector('div#main-container')
const wishlistUl = document.createElement('ul')
const visitedUl = document.createElement('ul')
const wishlist = document.querySelector('div#wishlist')
const visitedDiv = document.querySelector('div#visited')
const ballparks = document.querySelector('header.main-title')
const ballparkUl = document.createElement('ul')
const userRatingForm = document.querySelector('form#user-rating')
// const username = loginDiv.querySelector('input#login-form').value

const parkDetails = document.createElement('div')
const img = document.createElement('img')
const parkLocation = document.createElement('p')
const parkName = document.createElement('h5')
const yearOpened = document.createElement('p')
const capacity = document.createElement('p')
const nickname = document.createElement('h6')
const team = document.createElement('p')
ballparks.append(parkDetails)
parkDetails.append(parkName, nickname, parkLocation, team, yearOpened, capacity, img)

// console.log(username)

/********************New User Form Listener***************************/
loginDiv.addEventListener('submit', event => {
    event.preventDefault()
    if (event.target.matches('form#new-user-form')) {
        const user = loginDiv.querySelector('input#new-user-input').value
        const favoriteTeam = loginDiv.querySelector('input#new-user-favorite-team').value
        fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({
                name: user,
                favorite_team: favoriteTeam
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                // divMain.dataset.id = data.id 
                divMain.style.display = 'block'
                loginDiv.style.display = 'none'

            })
    }
/*****************User Login Listener******************************/
    if (event.target.matches('form#user-login')) {
        const username = loginDiv.querySelector('input#login-form').value
        divMain.dataset.username = username
        // console.log(username)

        fetch(`http://localhost:3000/users/${username}`)
            .then(resp => resp.json())
            .then(data => {
                // console.log(data)
                divMain.style.display = 'block'
                loginDiv.style.display = 'none'
                wishlist.append(wishlistUl)
                visitedDiv.append(visitedUl)
                ballparks.append(ballparkUl)
                data.user_ballparks.forEach(ballpark =>{
                    // console.log(ballpark.ballpark.home_team)
                    const ballparkLi = document.createElement('li')
                    ballparkLi.textContent = ballpark.ballpark.home_team
                    ballparkLi.dataset.userBallparkId = ballpark.id 
                    ballparkUl.append(ballparkLi)
                    ballparkLi.dataset.id = ballpark.ballpark.id 
                })


                // data.user_ballparks.forEach(visit => {

                //     // console.log(visit)
                //     if(visit.wishlist === true){
                //         // const ballparkId = visit.ballpark_id
                //         // console.log(ballparkId)
                //         const wishLi = document.createElement('li')
                //         wishLi.dataset.ballparkId = visit.ballpark_id
                //         wishLi.innerText = visit.ballpark.name
                //         wishlistUl.append(wishLi)
                //     } if (visit.visited === true){
                //         // const ballparkId = visit.ballpark_id
                //         const visitLi = document.createElement('li')
                //         visitLi.dataset.ballparkId = visit.ballpark_id
                //         visitLi.innerText = visit.ballpark.name
                //         visitedUl.append(visitLi)
                //     }
                // })
                wishlistUl.innerHTML = ` `
                visitedUl.innerHTML = ` `
                wishList()
                visitList()
            })
    }
})
/*****************Ballparks Listener******************************/
ballparks.addEventListener('click', event => {
    if(event.target.matches('li')){
        
        fetch(`http://localhost:3000/ballparks/${event.target.dataset.id}`)
        .then(resp => resp.json())
        .then(data => {
            // console.log(data)
            userRatingForm.dataset.ballparkId = event.target.dataset.id
            userRatingForm.dataset.visitId = event.target.dataset.userBallparkId
            img.src = data.image
            parkLocation.innerText = data.location
            parkName.innerText = data.name 
            yearOpened.innerText = data.year_opened
            capacity.innerText = data.capacity
            nickname.innerText = data.nickname
            team.innerText = data.home_team
        })
    }
})


/*****************User Rating Form Listener******************************/

userRatingForm.addEventListener('submit', event => {
    
    event.preventDefault()
    const overall = event.target.overall_experience.value
    const concession = event.target.concession_rating.value
    const beauty = event.target.beauty_rating.value
    const price = event.target.overall_price_rating.value
    const crowd = event.target.crowd_rating.value
    const comments = event.target.comments.value
    const visited = event.target.querySelector('select#visited-bool').value
    const wishlist = event.target.querySelector('select#wishlist-bool').value
    // console.log(event.target.querySelector('select').value)

    const updatedObj = {

        overall_experience: overall,
        concession_rating: concession,
        beauty_rating: beauty,
        overall_price_rating: price,
        crowd_rating: crowd,
        comments: comments,
        visited: visited,
        wishlist: wishlist
    }
    // console.log(updatedObj)
    const id = userRatingForm.dataset.visitId
    // console.log(id)
    fetch(`http://localhost:3000/user_ballparks/${id}`,{
        method: 'PATCH',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(updatedObj)
    })
    .then(resp => resp.json())
    .then(data => {

        console.log(data)
        
        // if(data.ballpark_id == document.querySelector(`#wishlist > ul > li:nth-child(${id})`)){

        //     const ballparkRemove = document.querySelector(`#wishlist > ul > li:nth-child(${id})`)
        //     // ballparkRemove = ''
        // }
        wishlistUl.innerHTML = ` `
        visitedUl.innerHTML = ` `
        wishList()
        visitList()
    
        
       
    
    })
    
    
    
    
    event.target.reset()
})


function wishList() {
    const username = divMain.dataset.username
    fetch(`http://localhost:3000/users/${username}`)
    .then(resp => resp.json())
    .then(data => {


        console.log(data)
        data.wish_lists.forEach(wl => {

            const li = document.createElement('li')
            li.textContent = wl
            wishlistUl.append(li)

        })
    })

}

function visitList() {
    const username = divMain.dataset.username
    fetch(`http://localhost:3000/users/${username}`)
    .then(resp => resp.json())
    .then(data => {


        console.log(data)
        data.visit_lists.forEach(vl => {

            const li = document.createElement('li')
            li.textContent = vl
            visitedUl.append(li)

        })
    })

}


function renderLists(){
    wishlistUl.innerHTML = ' '
    visitedUl.innerHTML = ' '
    const username = divMain.dataset.username
    // console.log(username)
    fetch(`http://localhost:3000/users/${username}`)
    .then(resp => resp.json())
    .then(data => {
        // console.log(data)
    data.user_ballparks.forEach(visit => {

        // console.log(visit)
        if(visit.wishlist === true){
            const ballparkId = visit.ballpark_id
            // console.log(ballparkId)
            const wishLi = document.createElement('li')
            wishLi.innerText = visit.ballpark.name
            wishlistUl.append(wishLi)
        } if (visit.visited === true){
            const ballparkId = visit.ballpark_id
            const visitLi = document.createElement('li')
            visitLi.innerText = visit.ballpark.name
            visitedUl.append(visitLi)
        }
    })

})

}