document.addEventListener('DOMContentLoaded', event =>{

    // console.log('DOM fully loaded')
    const divMain = document.querySelector('div#main-container')
        divMain.innerHTML= ``
    
    const form = document.querySelector('div#form')
        form.innerHTML= ``
    
    const divNewUserForm = document.createElement('div')
    const divReturningUserForm = document.createElement('div')
    
    const newUserForm = document.createElement('form')
        newUserForm.id = 'new-user-form'
    
    const returningUserForm = document.createElement('form')
        returningUserForm.id = 'returning-user-form'
    
    divMain.append(divNewUserForm, divReturningUserForm)
    divNewUserForm.append(newUserForm)
    divReturningUserForm.append(returningUserForm)

    newUserForm.innerHTML= `
        <label> New Username </label>
        <input type="text" value="New User" id='new-user-input' ><br>
        <label> Favorite Team </label>
        <input type="text" value="Favorite Team" id='new-user-favorite-team' ><br>
        <input type="submit" value="Submit">`

    returningUserForm.innerHTML= `
        <label> Login </label>
        <input type="text" id="login-form" value="Login" >
        <input type="submit" value="Submit">`
        // console.log(newUserForm)
        
    newUserForm.addEventListener('submit', event =>{

        event.preventDefault()
        
        const user = newUserForm.querySelector('input#new-user-input').value
        const favoriteTeam = newUserForm.querySelector('input#new-user-favorite-team').value

        fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({
                name: user,
                favorite_team: favoriteTeam
            })
        })
            .then(response => response.json())
            .then(data => {

            console.log(data)

            const divWrapper = document.querySelector('div#main-wrapper')
            divWrapper.append(divMain)

        })

    })
})





fetch('http://localhost:3000/users')
    .then(resp => resp.json())
    .then(userArr => {

        // console.log(userArr)
        userArr.forEach(user => {

            console.log(user.name)
            const li = document.createElement('li')
            const main = document.querySelector('main')
            li.textContent = user.name
            main.append(li)
            
        })
    })