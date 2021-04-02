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
const mainHeader = document.querySelector('div#main-header')
const topRated = document.querySelector('div.top-rated-container')


// const username = loginDiv.querySelector('input#login-form').value

const updateForm = document.createElement('form')
updateForm.className= 'fav-team-form'
const parkDetails = document.createElement('div')
const img = document.createElement('img')
img.id= "ballpark-image"
const parkLocation = document.createElement('p')
const parkName = document.createElement('h2')
const yearOpened = document.createElement('p')
const capacity = document.createElement('p')
const nickname = document.createElement('h4')
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
        divMain.dataset.favTeam = favoriteTeam
        // divMain.dataset.favTeam = favoriteTeam
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
                divMain.dataset.username = data.name
                divMain.dataset.favTeam = data.favorite_team
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
                wishlistUl.innerHTML = ` `
                visitedUl.innerHTML = ` `
                updateForm.innerHTML = ' '
                wishList()
                visitList()
                favoriteTeamUpdateForm()


            })
    }
/*****************User Login Listener******************************/
    if (event.target.matches('form#user-login')) {
        const username = loginDiv.querySelector('input#login-form').value
        divMain.dataset.username = username
        // const favoriteTeam = loginDiv.querySelector('input#new-user-favorite-team').value
        
        // console.log(username)

        fetch(`http://localhost:3000/users/${username}`)
            .then(resp => resp.json())
            .then(data => {
                // console.log(data.favorite_team)
                divMain.dataset.favTeam = data.favorite_team
                divMain.style.display = 'block'
                loginDiv.style.display = 'none'
                wishlist.append(wishlistUl)
                visitedDiv.append(visitedUl)
                ballparks.append(ballparkUl)
                data.user_ballparks.forEach(ballpark =>{
                    // console.log(ballpark.ballpark.home_team)
                    const ballparkLi = document.createElement('li')
                    ballparkLi.className = 'ballpark-list'
                    ballparkLi.textContent = ballpark.ballpark.home_team
                    ballparkLi.dataset.userBallparkId = ballpark.id 
                    ballparkUl.append(ballparkLi)
                    ballparkLi.dataset.id = ballpark.ballpark.id 
                })
                wishlistUl.innerHTML = ` `
                visitedUl.innerHTML = ` `
                updateForm.innerHTML = ' '
                
                wishList()
                visitList()

                favoriteTeamUpdateForm()
            })
    }
})
/*****************Ballparks Listener******************************/
ballparks.addEventListener('click', event => {
    
    // console.log(h2)
    if(event.target.matches('li')){
        topRated.innerHTML = ' '
        ballParkVisit(event.target.dataset.userBallparkId)
        const ballparksDiv = document.querySelector('#inner-main > header > div')
        ballparksDiv.id= 'ballpark-details'
        
        fetch(`http://localhost:3000/ballparks/${event.target.dataset.id}`)
        .then(resp => resp.json())
        .then(data => {
            // console.log(data)
            userRatingForm.dataset.ballparkName = data.name
            userRatingForm.dataset.ballparkId = event.target.dataset.id
            userRatingForm.dataset.visitId = event.target.dataset.userBallparkId
            // ballparksDiv.id= 'ballpark-details'
            const h2 = userRatingForm.querySelector('h2')
            h2.innerHTML = `Log a visit for ${data.name}!`
            img.src = data.image
            parkLocation.innerText = `Location: ${data.location}`
            parkName.innerText = `${data.name}`
            yearOpened.innerText = `Year Opened: ${data.year_opened}`
            capacity.innerText = `Capacity: ${data.capacity}`
            nickname.innerText = data.nickname
            team.innerText = `Home of the ${data.home_team}`
        })
        
        console.log(event.target.dataset.userBallparkId)
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
        wishlistUl.innerHTML = ` `
        visitedUl.innerHTML = ` `
        updateForm.innerHTML = ' '
        favoriteTeamUpdateForm()
        wishList()
        visitList()
        topRated.innerHTML = ' '
        ballParkVisit(id)
    })
    
    event.target.reset()
})

/*****************Wish List Render******************************/
const wishList = () => {
    const username = divMain.dataset.username
    // console.log(username)
    return( fetch(`http://localhost:3000/users/${username}`)
    .then(resp => resp.json())
    .then(data => {
        // console.log(data)
        data.wish_lists.forEach(wl => {
            const li = document.createElement('li')
            li.className= 'wish-li'
            li.textContent = wl
            wishlistUl.append(li)
        })
    }).catch(errors => console.log(errors.message))
    )
}
/*****************Visit List render******************************/
const visitList = () => {
    const username = divMain.dataset.username
    return (fetch(`http://localhost:3000/users/${username}`)
    .then(resp => resp.json())
    .then(data => {
        // console.log(data)
        data.visit_lists.forEach(vl => {
            const li = document.createElement('li')
            li.textContent = vl
            visitedUl.append(li)
        })
    }).catch(errors => console.log(errors.message))
    )
}
/*****************Favorite Team Update Form Listener******************************/
const favoriteTeamUpdateForm = () => {
    // divMain.dataset.favTeam = data.favorite_team
    const favTeam = divMain.dataset.favTeam
    const username = divMain.dataset.username
    // console.log(username)
            updateForm.innerHTML = `
                <input type="text" id="favorite-team" value='${favTeam}' placeholder="Set Your New Fav Team">
                <input type='submit' name='submit' value="Update Fav Team" >
                `
            mainHeader.append(updateForm)

    mainHeader.addEventListener('submit', event => {
            event.preventDefault()
           
            const newFav = { favorite_team: event.target['favorite-team'].value}
            const update = document.querySelector('input#favorite-team').value
            // console.log(update)
        if(event.target.matches('form')){
            
            fetch(`http://localhost:3000/users/${username}`, {

                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(newFav)

                })
                .then(resp => resp.json())
                .then(data => {
                    wishlistUl.innerHTML = ` `
                    visitedUl.innerHTML = ` `
                    wishList()
                    visitList()
                    update.textContent = data.favorite_team
            })
        }
    })
}

/*****************User Rating Form Listener******************************/
const ballParkVisit = (id) => {
    // ballparkLi.dataset.userBallparkId
    console.log(id)

    fetch(`http://localhost:3000/user_ballparks/${id}`)
        .then(resp => resp.json())
        .then(data => {
            const parkName = data.ballpark.name 
            console.log(data)
            const overall = data.overall_experience
            const concession = data.concession_rating
            const beauty = data.beauty_rating
            const price = data.overall_price_rating
            const crowd = data.crowd_rating
            const comments = data.comments

            const h2 = document.createElement('h2')
            const overallP = document.createElement('li')
            const conP = document.createElement('li')
            const beautyP = document.createElement('li')
            const priceP = document.createElement('li')
            const crowdP = document.createElement('li')
            const commentBox = document.createElement('text-area')
            const ul = document.createElement('ul')
            

            h2.textContent = parkName
            overallP.textContent =`Overall Rating: ${overall}`
            conP.textContent = `Concession Rating: ${concession}`
            beautyP.textContent = `Beauty Rating: ${beauty}`
            priceP.textContent = `Overal Price Rating: ${price}`
            crowdP.innerHTML = `Crowd Rating: ${crowd} <br><br>`
            commentBox.innerHTML = `Comments: <br> ${comments}`
            topRated.append(h2)
            topRated.append(ul)
            ul.append(overallP, conP, beautyP, priceP, crowdP, commentBox)
        })
    // console.log(ballparkLi.dataset.userBallparkId)
}

