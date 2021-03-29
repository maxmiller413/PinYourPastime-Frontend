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