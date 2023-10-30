const faceBookBtn = document.getElementById('FACEBOOKIMAGE')
const twiiterBtn = document.getElementById('TWITTERIMAGE')
const linkdeinBtn = document.getElementById('LINKDEINIMAGE')
const contactUs = document.getElementById('contact')
const guide = document.getElementById('guide')
const logo = document.getElementById('logo')



faceBookBtn.addEventListener('click', () =>{
    const faceBookLink = "https://www.facebook.com/sharer/sharer.php?u="; 
    const navUrl = faceBookLink + window.location.href;
    window.open(navUrl , '_blank');
})


twiiterBtn.addEventListener('click', ()=>{
    let twiiterLink =   `https://twitter.com/intent/tweet?text=`; 
    const navUrl = twiiterLink + window.location.href;
    window.open(navUrl, '_blank');
})


linkdeinBtn.addEventListener('click', ()=>{
    let linkdeinLink = 'http://www.linkedin.com/shareArticle?mini=true&url='; 
    const navUrl = linkdeinLink + window.location.href;
    window.open(navUrl, '_blank');

})


contactUs?.addEventListener('click', () =>{
    let path = window.location.origin + '/contact'
    window.open(path, '_blank');
})

guide?.addEventListener('click', () =>{
    let path = window.location.origin + '/landing-pages/guide-download-page'
    window.open(path, '_blank');
})

function getEmailSubject(sub){

        let url = `mailto:?subject=%subject%&body=%text%`
        url = url.replace('%text%', window.location.href);
        url =url.replace('%subject%', sub);
        window.open(url, '_blank');
}

logo?.addEventListener('click', () =>{
    let path = window.location.origin + '/about-us/#blogs-resources-section'
    window.open(path,'_self');
})