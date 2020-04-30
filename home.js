function fijarHora() {
    let today = new Date();
    let min = today.getMinutes();
    let hora = today.getHours();
    if(min < 10) {
    min = `0${min}`;
    }
    document.getElementById('hora').setAttribute('value', `${hora}:${min}`);
}

function showLoader() {
    document.getElementById('loader').style.display = 'block';
    document.getElementsByClassName('container')[0].classList.add('addOpacity');
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
    document.getElementsByClassName('container')[0].classList.remove('addOpacity');
}

function fetchData() { 
    showLoader();
    fetch('https://hayk-project.now.sh/datos')
        .then(res => {
            return res.json();	
        })
        .then(json => {
            let temp = json.temp;
            let hum = json.hum;
            let lum = json.lum;
            temp = `${temp}°C`;
            hum = `${hum}%`;
            lum = `${lum}%`;
            document.getElementById('temp').setAttribute('value', `${temp}`);
            document.getElementById('hum').setAttribute('value', `${hum}`);
            document.getElementById('lum').setAttribute('value', `${lum}`);
        })
        .finally(() => {
            hideLoader();
        });
}

fijarHora();
fetchData();

function liveUpdate() { 
    setInterval( () => {
        fetchData();
        fijarHora();
    }, 30000)
}

document.addEventListener('DOMContentLoaded', () => {
    liveUpdate();
})