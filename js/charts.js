//crea un grafico con los datos del registro seleccionado mediante la libreria highchart.js

//la funcion charts recibe por parámetro el cartodb_id del barrio seleccionado en el mapa
//y hace una peticion getJson a la tabla
function charts(data_id) {
	var campo = data_id;
	var url ="http://mac.cartodb.com/api/v2/sql?q=SELECT nbarri,rfd_2008,rfd_2009,rfd_2010, rfd_2011 FROM renta_barris_08_11_e WHERE cartodb_id="+campo+""
    console.log(url);
	var cartoItems = [];
	$.getJSON(url, function(data) {
        $.each(data.rows, function(key, val) {
            cartoItems.push(val.rfd_2008);
            cartoItems.push(val.rfd_2009);
            cartoItems.push(val.rfd_2010);
            cartoItems.push(val.rfd_2011);
            barrio = val.nbarri;
        });
        console.log(cartoItems);
        console.log(barrio);
        creaChart(cartoItems,barrio);
    });
};

function creaChart(cartoData,barrio){
    $('#highchart').highcharts({
        chart: {
            type: 'line',
            marginRight: 50,
            marginBottom: 50,
            marginTop:100
        },
        title: {
            text: 'Distribución Renta BCN | Indice RFD',
            x: -20 //center
        },
        subtitle: {
            text: 'Fuente Dtos: <a href="http://opendata.bcn.cat/opendata/cataleg/SOCIETAT_I_BENESTAR/rendafam-a/">Opendata.bcn.cat</a><br/>BCN=100',
            x: -20
        },
        //años
        xAxis: {
            categories: ['2008', '2009', '2010', '2011']
        },
        //rfd
        yAxis: {
            title: {
                text: 'Indice RDF'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '',
            valuePrefix: 'RFD: '
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -20,
            y: 60,
            borderWidth: 0
        },
        series: [{
            name: barrio,
            data: cartoData
        }]
    });
};
