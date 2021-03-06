
var map;//define el mapa
var selected_year = $('.year.selected').attr('id'); //define que año esta seleccionado 
var sublayer0; // rdf layer
// crea el selector de querys
function createSelector(layer) {

    var sql = new cartodb.SQL({ user: 'mac' });

    var $options = $('#layer_selector li');

    //al cambiar de año, all vuelve a estar selected
    $('.rfd').removeClass('selected');
    $('.all').addClass('selected'); 
    
    //seleccion por query al index_rfd
    $options.click(function(e) {

        // get the area of the selected layer
        var $li = $(e.target);
        var indice = $li.attr('data');

        // deselect all and select the clicked one
        $options.removeClass('selected');
        $li.addClass('selected');

        // create query based on data from the layer
        var query =  "SELECT * FROM renta_barris_08_11_e";

        if(indice !== 'all') {
        
            query = "SELECT * FROM renta_barris_08_11_e where rfd_"+ selected_year +" < " +indice ;
        
            if(indice == '100' || indice == '150' || indice == '200') {
                query = "SELECT * FROM renta_barris_08_11_e where rfd_"+ selected_year +" > " +indice ;
            }
        }

        // cambia la query de la capa al actualizar el mapa
        console.log(query);
        //var sublayer = layer.getSubLayer(0);
        layer.setSQL(query);
    });//options
}//create selector

        
        
function init(){
    // inicializa el mapa leaflet
    map = new L.Map('map', { 
        center: [41.40,2.18],
        zoom: 12,
        minZoom: 10,
        maxZoom: 16
    })
    
    //define la capabase y la añade al mapa
    L.tileLayer('http://tile.stamen.com/toner-background/{z}/{x}/{y}.png', {
        attribution: 'Stamen'
    }).addTo(map);

    //define un array de layers
    var layers = [];

    //crea capa con la tabla 'renta barrios08_11': layers[0]
    //
    //define el enlace para crerar la visualizacion con el nombre de usuario y la tabla
    //var layer0Url = 'http://mac.cartodb.com/api/v1/viz/renta_barris_08_11_e/viz.json';
    var layer0Url = 'https://mac.cartodb.com/api/v2/viz/7e833316-f122-11e5-b444-0e3ff518bd15/viz.json';
    
    //define la query y el estilo CartoCSS iniciales para la capa[0] (renta_barris)
    var layer0Options = {
        sql: "SELECT * FROM renta_barris_08_11_e",
        cartocss: "#renta_barris_08_11_e{[ rfd_" + selected_year + " <= 250]{polygon-fill: #B10026;}[ rfd_" + selected_year + " <= 180]{polygon-fill: #E31A1C;}[ rfd_" + selected_year + " <= 140]{polygon-fill: #FC4E2A;}[ rfd_" + selected_year + " <= 110]{polygon-fill: #FD8D3C;}[ rfd_" + selected_year + " <= 80]{polygon-fill: #FEB24C;}[ rfd_" + selected_year + " <= 70]{polygon-fill: #FED976;}[ rfd_" + selected_year + " <= 60]{polygon-fill: #FFFFB2;}[ rfd_" + selected_year + " <= 45]{polygon-fill: #FFFFCC;}line-color: #FFF;line-opacity: 1;line-width: 1;polygon-opacity: 0.8;}"
    };
    //carga la capa CartoDB
    cartodb.createLayer(map, layer0Url, layer0Options)
        .on('done', function(layer) {
            map.addLayer(layer);
            sublayer0 = layer.getSubLayer(0);
            sublayer0.infowindow.set('template', $('#infowindow_template0').html());

            layers.push(layer);//mete la layer[0] al array de capas
            createSelector(sublayer0);
            //añade un evento de click que llama a la funcion que dibuja el 
            //gráfico pasandole como parámetro el cartodb_id
            layer.on('featureClick', function(e, pos, latlng, data) {
                $('#chartContainer').removeClass('hide');
                charts(data.cartodb_id);
            });
        }).on('error', function() {
        //log the error
        console.log('error');
    });
   
    // Actualiza el mapa de los barrios cambiando las "layers options" al año seleccionado
    function updateQuery0() {
        console.log(selected_year);
      
        var subLayerOptions = {
            sql: "SELECT * FROM renta_barris_08_11_e",
            cartocss: "#renta_barris_08_11_e{[ rfd_" + selected_year + " <= 250]{polygon-fill: #B10026;}[ rfd_" + selected_year + " <= 180]{polygon-fill: #E31A1C;}[ rfd_" + selected_year + " <= 140]{polygon-fill: #FC4E2A;}[ rfd_" + selected_year + " <= 110]{polygon-fill: #FD8D3C;}[ rfd_" + selected_year + " <= 80]{polygon-fill: #FEB24C;}[ rfd_" + selected_year + " <= 70]{polygon-fill: #FED976;}[ rfd_" + selected_year + " <= 60]{polygon-fill: #FFFFB2;}[ rfd_" + selected_year + " <= 45]{polygon-fill: #FFFFCC;}line-color: #FFF;line-opacity: 1;line-width: 1;polygon-opacity: 0.9;}"
        };

        sublayer0.set(subLayerOptions);
        createSelector(sublayer0);
    }
    // Crea una capa con las lineas de metro. layers[1]
    var layer1Url ="https://mac.cartodb.com/api/v2/viz/b0e59b1a-f121-11e5-9bc2-0e3ff518bd15/viz.json";

    var layer1Options = {
        sql:"SELECT * FROM lineas_metro",
        cartocss: "#lineas_metro{[linea = 1] {line-color: #FF0000;}[ linea = 2]{line-color: #FF00FF;}[ linea = 3] {line-color: #80FF00;}[ linea = 4]{line-color: #FFFF00;}[ linea = 5]{line-color: #8080FF;}[ linea = 6] {line-color: #8080C0;}[ linea = 7] {line-color: #ED811F;}[ linea = 8] {line-color: #FF80FF;}[ linea = 9] {line-color: #FFBB77;}[ linea = 10] {line-color: #FF6215;}[ linea = 11] {line-color: #2E9E52;}line-opacity: 0.8;line-width: 3;}"
    }
    cartodb.createLayer(map, layer1Url,layer1Options)
        .on('done', function(layer) {
            map.addLayer(layer);
            layers.push(layer);//mete la layer[1] al array de capas
            layers[1].hide();
        }).on('error', function() {
            //log the error
        });
  
    //crea una capa con la tabla de las estaciones, 'metro_rfd': layers[2]
    var layer2Url = 'https://mac.cartodb.com/api/v2/viz/31969c50-f122-11e5-9df3-0ecd1babdde5/viz.json';
    var layer2Options = {
        sql: "SELECT * FROM metro_rfd",
        cartocss: "#metro_rfd{[ rfd_" + selected_year + " <= 100]{first/marker-fill: #9595FF;second/marker-fill: #5353FF;third/marker-fill: #0000FF}[ rfd_"+ selected_year+" > 100]{first/marker-fill: #008000;second/marker-fill: #0FFF0F;third/marker-fill: #00E100;}first/marker-opacity: 0.05;first/marker-width: 50;first/marker-line-width: 0;first/marker-placement: point;first/marker-allow-overlap: true;first/marker-comp-op: lighten;second/marker-opacity: 0.08;second/marker-width:30;second/marker-line-width: 0;second/marker-placement: point;second/marker-allow-overlap: true;second/marker-comp-op: lighten;third/marker-opacity: 0.5;third/marker-width:8;third/marker-line-width: 0;third/marker-placement: point;third/marker-allow-overlap: true;third/marker-comp-op: lighten;}"
    }
    cartodb.createLayer(map, layer2Url,layer2Options)
        .on('done', function(layer) {
            var sublayer2 = layer.getSubLayer(0);

            sublayer2.infowindow.set('template', $('#infowindow_template1').html());
            map.addLayer(layer);

            layers.push(layer);//mete la layer[2] al array de capas
            layers[2].hide();
        }).on('error', function() {
            //log the error
        });
    
    //Actualiza el mapa cambiando las "layers options" al año seleccionado
    function updateQuery2() {
        layers[2].setOptions ({
            sql: "SELECT * FROM renta_barris_08_11_e",
            cartocss: "#renta_barris_08_11_e{[ rfd_"+selected_year+" <= 100]{first/marker-fill: #9595FF;second/marker-fill: #5353FF;third/marker-fill: #0000FF}[ rfd_"+ selected_year+" > 100]{first/marker-fill: #008000;second/marker-fill: #0FFF0F;third/marker-fill: #00E100;}first/marker-opacity: 0.05;first/marker-width: 50;first/marker-line-width: 0;first/marker-placement: point;first/marker-allow-overlap: true;first/marker-comp-op: lighten;second/marker-opacity: 0.08;second/marker-width:30;second/marker-line-width: 0;second/marker-placement: point;second/marker-allow-overlap: true;second/marker-comp-op: lighten;third/marker-opacity: 0.5;third/marker-width:8;third/marker-line-width: 0;third/marker-placement: point;third/marker-allow-overlap: true;third/marker-comp-op: lighten;}"
        });
    }


    //seleccion del año del que se muestran datos de rfd
    $('.year').click(function(){
        $('.year').removeClass('selected');
        $(this).addClass('selected'); 
        selected_year = $(this).attr('id');
        updateQuery0();
        //updateQuery2();
    });

    //encender y apagar capas (barrios, estaciones y lineas de metro)
    $('.capas').click(function(){
        if ($(this).hasClass('selected')){
            $(this).removeClass('selected');
            if ($(this).attr('id')=='barrios'){
              layers[0].hide();
            }
            if ($(this).attr('id')=='estaciones'){
              layers[2].hide();
            }
            if ($(this).attr('id')=='lineas'){
              layers[1].hide();
            }
        }
        else {
            $(this).addClass('selected');
            if ($(this).attr('id')=='barrios'){
                layers[0].show();
            }
            if ($(this).attr('id')=='estaciones'){
                layers[2].show();
            }
            if ($(this).attr('id')=='lineas'){
                layers[1].show();
            }
        }

    });
    //ocultar el gráfico
    $("#chartHide").click(function(){
        $('#chartContainer').addClass('hide');
    });

}//init
