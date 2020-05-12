
let ctx = document.getElementById('myChart').getContext('2d');
let chart = new Chart(ctx, {
	type: 'line',
	data: {
		labels: [],
		datasets: [
			{
			label: 'Humedad [%]',
			borderColor: 'rgb(43, 158, 179)',
			data: [],
			yAxisID: 'eje1'
				},
			{
			label: 'Iluminación [%]',
			borderColor: 'rgb(253, 184, 32)',
			data: [],
			yAxisID: 'eje1'
			},
			{
			label: 'Temperatura [°C]',
			borderColor: 'rgb(248, 51, 60)',
			data: [],
			yAxisID: 'eje2'
				}
			]
		},
	options: {
		responsive: true,
		elements: {
            point:{
                radius: 0,
				borderWidth: 0,
				hitRadius: 2.5
            }
		},
		title: {
			display: true,
			text: 'Datos del día de hoy',
			fontSize: 20 
		},
		layout: {
			padding: {
				left: 5,
				right: 5,
				top: 5,
				bottom: 5
		},
		},
		scales: {
			xAxes: [{
				type: 'time',
				ticks: {
					autoSkip: true,
					maxRotation: 0,
					maxTicksLimit: 12
				},
				time: {
					unit: 'minute',
					displayFormats: {
						minute: 'HH:mm',
						hour: 'HH',
					},
					tooltipFormat: "DD/MM/YYYY HH:mm"
				}
			}],
			yAxes: [{
                id: 'eje1',
                type: 'linear',
				position: 'left',
				ticks: {
					min: 0,
					max: 100,
					callback: function(value, index, values) {
                        return `${value}%`;
                    }
				}
			}, 
			{
                id: 'eje2',
                type: 'linear',
				position: 'right',
				gridLines: {
					display: false,
				  },
				ticks: {
					min: 0,
					max: 45,
					callback: function(value, index, values) {
                        return `${value}°C`;
                    }
				}
            }]
		}
	}
});
