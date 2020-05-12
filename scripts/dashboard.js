let periodo = 'hoy';
let serie = document.getElementById('serie').dataset.serie;
let data = {
	serie: serie
}

function dataGraph(periodo) {
	let url =`./api/graficos/${periodo}`; 
	fetch(url, {
		mode: 'cors',
		method: 'POST',
		body: JSON.stringify(data),
		headers: { 
			'Content-Type': 'application/json'}
	})
    .then(res => {
		return res.json();	
	})
	.then(json => {
		chart.data.labels = json.timeArray;
		chart.data.datasets[0].data = json.humArray;
		chart.data.datasets[1].data = json.lumArray;
		chart.data.datasets[2].data = json.tempArray;
		if(periodo === 'hoy'){
			chart.options.title.text = 'Datos del día de hoy'; }
		else if(periodo === 'semana') {
			chart.options.title.text = 'Datos de la última semana';
			chart.options.scales.xAxes[0].time.displayFormats = {
				hour: 'DD MMM hA',
				day: 'DD MMM',
				month: 'MMM',
			};
			chart.options.scales.xAxes[0].ticks.maxTicksLimit = 8;
		}
		else if(periodo === 'mes') {
			chart.options.title.text = 'Datos del último mes';
			chart.options.scales.xAxes[0].time.displayFormats = {
				day: 'DD MMM',
				month: 'MMM',
			};
			chart.options.scales.xAxes[0].ticks.maxTicksLimit = 8;
		}
		chart.update();
	});
}

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

function fetchData() { 
    fetch('./api/datos', {
		mode: 'cors',
		method: 'POST',
		body: JSON.stringify(data),
		headers: { 
			'Content-Type': 'application/json'
		}
	})
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
