
let periodo = 'hoy';

function cambiarPeriodo(per) {
periodo = per;
let botonHoy = document.getElementById("botonHoy");
let botonSemana = document.getElementById("botonSemana");
let botonMes = document.getElementById("botonMes");	
if(per === 'hoy') {
	botonHoy.setAttribute("class", 'botonEncendido');
	botonHoy.disabled = true;
	botonSemana.setAttribute('class', 'botonApagado');
	botonSemana.disabled = false;
	botonMes.setAttribute('class', 'botonApagado');
	botonMes.disabled = false;
} else if (per === 'semana') {
	botonHoy.setAttribute("class", 'botonApagado');
	botonHoy.disabled = false;
	botonSemana.setAttribute('class', 'botonEncendido');
	botonSemana.disabled = true;
	botonMes.setAttribute('class', 'botonApagado');
	botonMes.disabled = false;
} else if (per === 'mes') {
	botonHoy.setAttribute("class", 'botonApagado');
	botonHoy.disabled = false;
	botonSemana.setAttribute('class', 'botonApagado');
	botonSemana.disabled = false;
	botonMes.setAttribute('class', 'botonEncendido');
	botonMes.disabled = true;
}
dataGraph(per);
}

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
		datasets: [
		{
			label: 'Temperatura',
			borderColor: 'rgb(248, 51, 60)',
			data: []
				},
			{
			label: 'Humedad',
			borderColor: 'rgb(43, 158, 179)',
			data: []
				},
			{
			label: 'Iluminación',
			borderColor: 'rgb(253, 184, 32)',
			data: []
			}]
		},
		// Configuration options go here
		options: {
			responsive: false,
			title: {
            display: true,
			text: 'Datos del día de hoy',
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
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Date'
					},
					ticks: {
						major: {
							fontStyle: 'bold',
							fontColor: '#FF0000'
							}
						}
            		}]
				}
			}
		}
	});



function dataGraph(periodo) {
	let url =`https://kassen.now.sh/graficos/${periodo}`; 
	fetch(url)
    .then(res => {
		return res.json();	
	})
	.then(json => {
		let tempData = [];
		let humData = [];
		let lumData = [];	
		for(let i = 0; i < json.timeArray.length; i++){
			tempData[i] = {
				x: json.timeArray[i],
				y: json.tempArray[i]
			}
			humData[i] = {
				x: json.timeArray[i],
				y: json.humArray[i]
			}
			lumData[i] = {
				x: json.timeArray[i],
				y: json.lumArray[i]
			}			
		 }
		console.log(tempData);
		chart.data.datasets[0].data = tempData;
		chart.data.datasets[1].data = humData;
		chart.data.datasets[2].data = lumData;
		if(periodo === 'hoy'){
			chart.options.title.text = 'Datos del día de hoy'; }
		else if(periodo === 'semana') {
			chart.options.title.text = 'Datos de la última semana'; }
		else if(periodo === 'mes') {
			chart.options.title.text = 'Datos del último mes'; }
		chart.update();
	});
}

dataGraph(periodo);
fijarHora();
fetchData();

function liveUpdate() { 
    setInterval( () => {
        fetchData();
        fijarHora();
		dataGraph(periodo);
	}, 60000)
}

document.addEventListener('DOMContentLoaded', () => {
    liveUpdate();
})

