let periodo = 1;
let serie = document.getElementById('serie').dataset.serie;
let data = {
    serie: serie,
};

function fetchData() {
    fetch('./api/datos', {
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => {
            return res.json();
        })
        .then((json) => {
            let temp = `${json.temp}°C`;
            let hum = `${json.hum}%`;
            let lum = `${json.lum}%`;
            document.getElementById('temp').setAttribute('value', `${temp}`);
            document.getElementById('hum').setAttribute('value', `${hum}`);
            document.getElementById('lum').setAttribute('value', `${lum}`);
        });
}

function dataGraph(periodo) {
    let url = `./api/graficos`;
    data.periodo = periodo;
    fetch(url, {
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => {
            return res.json();
        })
        .then((json) => {
            chart.data.labels = json.timeArray;
            chart.data.datasets[0].data = json.humArray;
            chart.data.datasets[1].data = json.lumArray;
            chart.data.datasets[2].data = json.tempArray;
            if (periodo === 1) {
                chart.options.title.text = 'Datos del día de hoy';
                chart.options.scales.xAxes[0].time.unit = 'minute';
                chart.options.scales.xAxes[0].time.displayFormats = {
                    minute: 'HH:mm',
                    hour: 'HH',
                };
            } else if (periodo === 7) {
                chart.options.title.text = 'Datos de la última semana';
                chart.options.scales.xAxes[0].time.unit = 'hour';
                chart.options.scales.xAxes[0].time.displayFormats = {
                    hour: 'D MMM ha',
                    day: 'D MMM',
                    month: 'MMM',
                };
                chart.options.scales.xAxes[0].ticks.maxTicksLimit = 8;
            } else if (periodo === 30) {
                chart.options.title.text = 'Datos del último mes';
                chart.options.scales.xAxes[0].time.unit = 'hour';
                chart.options.scales.xAxes[0].time.displayFormats = {
                    hour: 'D MMM ha',
                    day: 'D MMM ha',
                    month: 'MMM',
                };
                chart.options.scales.xAxes[0].ticks.maxTicksLimit = 8;
            }
            chart.update();
        });
}

function cambiarPeriodo(per) {
    periodo = per;
    let botonHoy = document.getElementById('botonHoy');
    let botonSemana = document.getElementById('botonSemana');
    let botonMes = document.getElementById('botonMes');
    if (per === 1) {
        botonHoy.setAttribute('class', 'botonEncendido');
        botonHoy.disabled = true;
        botonSemana.setAttribute('class', 'botonApagado');
        botonSemana.disabled = false;
        botonMes.setAttribute('class', 'botonApagado');
        botonMes.disabled = false;
    } else if (per === 7) {
        botonHoy.setAttribute('class', 'botonApagado');
        botonHoy.disabled = false;
        botonSemana.setAttribute('class', 'botonEncendido');
        botonSemana.disabled = true;
        botonMes.setAttribute('class', 'botonApagado');
        botonMes.disabled = false;
    } else if (per === 30) {
        botonHoy.setAttribute('class', 'botonApagado');
        botonHoy.disabled = false;
        botonSemana.setAttribute('class', 'botonApagado');
        botonSemana.disabled = false;
        botonMes.setAttribute('class', 'botonEncendido');
        botonMes.disabled = true;
    }
    dataGraph(per);
}

function fijarHora() {
    let hora = moment().format('HH:mm');
    document.getElementById('hora').setAttribute('value', `${hora}`);
}

fijarHora();
fetchData();
dataGraph(periodo);

document.addEventListener('DOMContentLoaded', () => {
    liveUpdate();
});
