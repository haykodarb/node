let periodo = 1;
let serie = document.getElementById('serie').dataset.serie;
let datepicker = document.getElementById('date-select');
datepicker.addEventListener('change', graphOnDatePick);

datepicker.setAttribute('value', moment().subtract(1, 'days').format('YYYY-MM-DD'));
datepicker.setAttribute('max', moment().subtract(1, 'days').format('YYYY-MM-DD'));

function fetchFirst() {
    let data = {
        serie: serie,
    };
    fetch('./api/fechaMin', {
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
            datepicker.setAttribute('min', moment(json.tiempo).format('YYYY-MM-DD'));
        });
}

function graphOnClick(periodo) {
    let url = `./api/graph_btn`;
    let input = {
        serie: serie,
        periodo: periodo,
    };
    fetch(url, {
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify(input),
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
                let i = json.timeArray.length - 1;
                document.getElementById('temp').setAttribute('value', `${json.tempArray[i]}°C`);
                document.getElementById('hum').setAttribute('value', `${json.humArray[i]}%`);
                document.getElementById('lum').setAttribute('value', `${json.lumArray[i]}%`);
                let hora = moment(json.timeArray[i]).format('HH:mm');
                document.getElementById('hora').setAttribute('value', `${hora}`);
                chart.options.title.text = 'Datos de las últimas 24hs';
                chart.options.scales.xAxes[0].time.unit = 'minute';
                chart.options.scales.xAxes[0].time.displayFormats = {
                    minute: 'HH:mm',
                    hour: 'HH',
                };
                chart.options.scales.xAxes[0].ticks.maxTicksLimit = 12;
            } else if (periodo === 7) {
                chart.options.title.text = 'Datos de la última semana';
                chart.options.scales.xAxes[0].time.unit = 'hour';
                chart.options.scales.xAxes[0].time.displayFormats = {
                    hour: 'DMMM ha',
                    day: 'DMMM',
                    month: 'MMM',
                };
                chart.options.scales.xAxes[0].ticks.maxTicksLimit = 9;
            }
            chart.update();
        });
}

function graphOnDatePick() {
    dateClicked();
    const selectedDate = datepicker.value;
    const dateOnGraph = moment(selectedDate).format('DD/MM/YYYY');
    let url = './api/graph_picker';
    let input = {
        date: selectedDate,
        serie: serie,
    };
    fetch(url, {
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify(input),
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
            chart.options.title.text = `Datos del día ${dateOnGraph}`;
            chart.options.scales.xAxes[0].time.unit = 'minute';
            chart.options.scales.xAxes[0].time.displayFormats = {
                minute: 'HH:mm',
                hour: 'HH',
            };
            chart.options.scales.xAxes[0].ticks.maxTicksLimit = 12;
            chart.update();
        });
}

function cambiarPeriodo(per) {
    periodo = per;
    let botonHoy = document.getElementById('botonHoy');
    let botonSemana = document.getElementById('botonSemana');
    if (per === 1) {
        botonHoy.setAttribute('class', 'botonEncendido');
        botonHoy.disabled = true;
        botonSemana.setAttribute('class', 'botonApagado');
        botonSemana.disabled = false;
        datepicker.setAttribute('class', 'dateSelectApagado');
    } else if (per === 7) {
        botonHoy.setAttribute('class', 'botonApagado');
        botonHoy.disabled = false;
        botonSemana.setAttribute('class', 'botonEncendido');
        botonSemana.disabled = true;
        datepicker.setAttribute('class', 'dateSelectApagado');
    }
    graphOnClick(per);
}

function dateClicked() {
    let botonHoy = document.getElementById('botonHoy');
    let botonSemana = document.getElementById('botonSemana');
    botonHoy.setAttribute('class', 'botonApagado');
    botonHoy.disabled = false;
    botonSemana.setAttribute('class', 'botonApagado');
    botonSemana.disabled = false;
    datepicker.setAttribute('class', 'dateSelectEncendido');
}

fetchFirst();
graphOnClick(periodo);
