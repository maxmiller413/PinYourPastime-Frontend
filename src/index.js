
const loginDiv = document.querySelector('div#login-container')
const divMain = document.querySelector('div#main-container')
const wishlistUl = document.createElement('ul')
const visitedUl = document.createElement('ul')
const wishlist = document.querySelector('div#wishlist')
const visitedDiv = document.querySelector('div#visited')
const ballparks = document.querySelector('header.main-title')
const ballparkUl = document.createElement('ul')




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

    if (event.target.matches('form#user-login')) {
        const username = loginDiv.querySelector('input#login-form').value
        // console.log(username)
        fetch(`http://localhost:3000/users/${username}`)
            .then(resp => resp.json())
            .then(data => {
                console.log(data.ballparks)
                divMain.style.display = 'block'
                loginDiv.style.display = 'none'
                wishlist.append(wishlistUl)
                visitedDiv.append(visitedUl)
                ballparks.append(ballparkUl)
                data.ballparks.forEach(ballpark =>{
                    // console.log(ballpark.name)
                    const ballparkLi = document.createElement('li')
                    ballparkLi.dataset.id = ballpark.id 
                    ballparkLi.textContent = ballpark.home_team
                    ballparkUl.append(ballparkLi)

                })
                data.user_ballparks.forEach(visit => {
                    if(visit.wishlist === true){
                        const ballparkId = (visit.ballpark_id)
                        // console.log(data)
                        const wishLi = document.createElement('li')
                        wishLi.innerText = data.ballparks[(ballparkId)- 1].name 
                        wishlistUl.append(wishLi)
                    } else if (visit.visited === true){
                        const ballparkId = visit.ballpark_id
                        const visitLi = document.createElement('li')
                        visitLi.innerText = data.ballparks[(ballparkId)- 1].name 
                        visitedUl.append(visitLi)
                    }
                    
                })
                
            })
    }
})

ballparks.addEventListener('click', event => {
    if(event.target.matches('li')){
        fetch(`http://localhost:3000/ballparks/${event.target.dataset.id}`)
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
        })
    }
})

