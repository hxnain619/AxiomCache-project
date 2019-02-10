if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then(function(reg) {
      // registration worked
      console.log('Registration succeeded. Scope is ' + reg.scope);
    }).catch(function(error) {
      // registration failed
      console.log('Registration failed with ' + error);
    });
  }

  var deferredPrompt= false;
window.addEventListener("load", () => {
    deferredPrompt = true;
})
window.addEventListener('beforeinstallprompt', (e) => {
    if(deferredPrompt){
        e.prompt();
    }else {
        console.log('trigger is not trigerred!!');
    }

});
  
  function GetData() {

  let spinner;
  const userName = document.querySelector('.Search');  
  const mainContainer = document.querySelector('#main');

fetch(`https://api.github.com/users/${userName.value}`)
  .then((response) => {
      
    userInfoObject = response.json();
    
    return userInfoObject;

  })
  .then( userInfoObject => {

    if(userInfoObject.name === null){

      userName.value = ""; 
    alert('User Not Found !!');

    }
    else{

      spinner = document.createElement('div');
      mainContainer.appendChild(spinner);
      spinner.style.display='block';
      spinner.setAttribute('class','spinner');

      window.setTimeout(() => {

      const UserProfile_Container = document.createElement('div');
      const image = document.createElement('img');
      const heading = document.createElement('h1');
      const location = document.createElement('p');
      const bio = document.createElement('p');
      const  ol = document.createElement('ol');


      image.src = userInfoObject.avatar_url;
      heading.innerHTML = userInfoObject.name;

      location.innerHTML = `
        <img src='locate-icon.png' class='locate-img' > ${userInfoObject.location}
         `;
        
      bio.innerHTML = `
        <p class='bio_para'><span class='bio'> Bio </span> : <span class='bio_content'> ${userInfoObject.bio}</span> </p> 
        `;
        
      ol.innerHTML = 
        `<li id="follower"><span class='follower' > Follower </span> <span class="Number">  ${userInfoObject.followers} </span> </li>` 
           +
        `<li id="following"><span class='following' > Following </span> <span class="Number"> ${userInfoObject.following} </span> </li> `
            + 
        `<li id="repos"><span class="repository" > Respository </span><span class="Number"> ${userInfoObject.public_repos}</span> </li>`;

        UserProfile_Container.setAttribute('class','profile_container');
        image.setAttribute('class','profile_image');
        location.setAttribute('class','location');

        image.onclick = () =>  open(userInfoObject.html_url);
        ol.querySelector('#repos').onclick = () => {
          open(`https://github.com/${userName.value}?tab=repositories`)
         }
        ol.querySelector('#follower').onclick = () => {
           open(`https://github.com/${userName.value}?tab=followers`)
         } 
        ol.querySelector('#following').onclick = () => {
           open(`https://github.com/${userName.value}?tab=following`)
         }

        UserProfile_Container.appendChild(image);
        UserProfile_Container.appendChild(heading);
        UserProfile_Container.appendChild(location);
        UserProfile_Container.appendChild(bio);
        UserProfile_Container.appendChild(ol);
        mainContainer.appendChild(UserProfile_Container);
          userName.value = "";
          spinner.style.display = 'none';
      },2000);
    }
  });

}
