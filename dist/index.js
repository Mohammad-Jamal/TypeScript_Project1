"use strict";
const getUser = document.querySelector("#user"); //give type assertions like this when dealing with DOM elements
// const formSubmit:HTMLFormElement | null = document.querySelector("#form") //you could also specify like this but we have give optionals while dealing with this
const formSubmit = document.querySelector("#form");
const main_container = document.querySelector(".main-container");
async function myCustomFetcher(url, option) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Network response was not ok - status : ${response.status}`);
    }
    const data = await response.json();
    // console.log(data);
    return data;
}
//Lets display the UI
const showResultUI = (singleUser) => {
    const { avatar_url, url, login } = singleUser;
    main_container.insertAdjacentHTML("beforeend", `
      <div class="card">
        <img src=${avatar_url} alt=${login} />
        <hr/>
        <div class="card-footer">
          <img src=${avatar_url} alt=${login} />
          <h2>${login.toUpperCase()}</h2>
          <a href=${url}>Github</a>
        </div>
      </div>
    `);
};
function fetchUserData(url) {
    myCustomFetcher(url, {}).then((userInfo) => {
        for (const singleUser of userInfo) {
            showResultUI(singleUser);
            // console.log(`Login : ${singleUser.login}`);
        }
    });
}
fetchUserData("https://api.github.com/users");
// Lets deal with Search Functionality
formSubmit.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchedData = getUser.value.toLowerCase();
    // console.log(searchedData);
    try {
        const url = "https://api.github.com/users";
        const allUserData = await myCustomFetcher(url, {});
        // Clear the main_container previous data before searching
        main_container.innerHTML = '';
        const matchingUsers = allUserData.filter((user) => {
            return user.login.toLowerCase().includes(searchedData);
        });
        if (matchingUsers.length === 0) {
            main_container?.insertAdjacentHTML("beforeend", `
          <h1>No User Data is found with the name '${searchedData}'...</h1> 
        `);
        }
        else {
            for (const singleUser of matchingUsers) {
                showResultUI(singleUser);
            }
        }
    }
    catch (error) {
        console.log({ message: error });
    }
});
