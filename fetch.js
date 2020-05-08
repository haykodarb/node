
function fijarHora() {
    let today = new Date();
    let min = today.getMinutes();
    let hora = today.getHours();
    if(min < 10) {
    min = `0${min}`;}
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
    fetch('https://kassen.now.sh/datos')
        .then(res => {
			return res.json();	
        })
        .then(json => {
			let temp = `${json.temp}°C`;
            let hum = `${json.hum}%`;
            let lum = `${json.lum}%`;
            document.getElementById('temp').setAttribute('value', `${temp}`);
            document.getElementById('hum').setAttribute('value', `${hum}`);
            document.getElementById('lum').setAttribute('value', `${lum}`);
		});
}

var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
	type: 'line',
	data: {
		labels: [],
		datasets: [{
			label: 'Temperatura',
			borderColor: 'rgb(255, 50, 50)',
			data: []
				},
			{
			label: 'Humedad',
			borderColor: 'rgb(0, 99, 132)',
			data: []
				},
			{
			label: 'Iluminación',
			borderColor: 'rgb(245, 233, 30)',
			data: []
			}]
		},
		// Configuration options go here
		options: {
			responsive: false,
			title: {
            display: true,
			text: 'Datos de las ultimas 24 horas',
			fontSize: 20 
			},
			layout: {
            	padding: {
                	left: 20,
                	right: 20,
                	top: 20,
                	bottom: 20
            },
			scales: {
            	xAxes: [{
                	type: 'time',
                	time: {
                    		displayFormats: {
								minute: 'hh:mm'
							}},
					distribution: 'linear',
					ticks: {
						source: 'auto',
						autoSkip: 'true',
						maxRotation: '0',
						padding: 2,
						},

            		}]
				}
			}
		}
	});

function dataGraph() {
	fetch('https://kassen.now.sh/graficos')
    .then(res => {
		return res.json();	
	})
	.then(json => {
		chart.data.labels = json.horaArray;
		chart.data.datasets[0].data = json.tempArray;
		chart.data.datasets[1].data = json.humArray;
		chart.data.datasets[2].data = json.lumArray;
		chart.update();
	});
}

dataGraph();
fijarHora();
fetchData();

function liveUpdate() { 
    setInterval( () => {
        fetchData();
        fijarHora();
		dataGraph();
	}, 60000)
}

document.addEventListener('DOMContentLoaded', () => {
    liveUpdate();
})
