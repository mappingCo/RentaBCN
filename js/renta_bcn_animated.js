

    var map,//define el mapa
        selected_year,//define el año
        layers=[];//define un array de layers
      
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

      //define la url para crear la capa con la tabla 'renta barrios08_11': layers[0]
      var layer0Url = 'http://mac.cartodb.com/api/v1/viz/renta_barris_08_09/viz.json';

      //define la query SQL y el estilo CartoCSS iniciales para la capa[0] (renta barrios)
      var layer0Options = {
        query: "SELECT * FROM {{table_name}}",
        tile_style: "#{{table_name}}{[ rfd_" + selected_year + " <= 250]{polygon-fill: #B10026;}[ rfd_" + selected_year + " <= 180]{polygon-fill: #E31A1C;}[ rfd_" + selected_year + " <= 140]{polygon-fill: #FC4E2A;}[ rfd_" + selected_year + " <= 110]{polygon-fill: #FD8D3C;}[ rfd_" + selected_year + " <= 80]{polygon-fill: #FEB24C;}[ rfd_" + selected_year + " <= 70]{polygon-fill: #FED976;}[ rfd_" + selected_year + " <= 60]{polygon-fill: #FFFFB2;}[ rfd_" + selected_year + " <= 45]{polygon-fill: #FFFFCC;}line-color: #FFF;line-opacity: 1;line-width: 1;polygon-opacity: 0.8;}"
      };
      //crea la capa CartoDB y la carga en el mapa
      cartodb.createLayer(map, layer0Url, layer0Options)
        .on('done', function(layer) {
          layer.infowindow.set('template', $('#infowindow_template0').html());
          map.addLayer(layer);
          layers.push(layer);

        }).on('error', function() {
          //log the error
        });

      //crea una capa con las lineas de metro. layers[1]
      var layer1Url ="http://mac.cartodb.com/api/v1/viz/lineas_metro/viz.json";
      var layer1Options = {
        query:"SELECT * FROM {{table_name}}",
        tile_style: "#{{table_name}}{[linea = 1] {line-color: #FF0000;}[ linea = 2]{line-color: #FF00FF;}[ linea = 3] {line-color: #80FF00;}[ linea = 4]{line-color: #FFFF00;}[ linea = 5]{line-color: #8080FF;}[ linea = 6] {line-color: #8080C0;}[ linea = 7] {line-color: #ED811F;}[ linea = 8] {line-color: #FF80FF;}[ linea = 9] {line-color: #FFBB77;}[ linea = 10] {line-color: #FF6215;}[ linea = 11] {line-color: #2E9E52;}line-opacity: 0.8;line-width: 3;}"
    
      }
      cartodb.createLayer(map, layer1Url,layer1Options)
        .on('done', function(layer) {
          //layer.infowindow.set('template', $('#infowindow_template1').html());
          map.addLayer(layer);
          layers.push(layer);
          layers[1].hide();//por defecto la capa esta escondida

        }).on('error', function() {
          //log the error
        });

      //crea una capa con la tabla 'metro_rfd': layers[1]
      var layer2Url = 'http://mac.cartodb.com/api/v1/viz/metro_rfd/viz.json';
      var layer2Options = {
        query: "SELECT * FROM {{table_name}}",
        tile_style: "#{{table_name}}{[ rfd_"+selected_year+" <= 55]{first/marker-fill: #9595FF;second/marker-fill: #5353FF;third/marker-fill: #0000FF;first/marker-opacity: 0.12;first/marker-width: 65;second/marker-opacity: 0.20;second/marker-width:35;third/marker-opacity: 0.9;third/marker-width:9;}[ rfd_"+selected_year+" <= 75]{first/marker-fill: #9595FF;second/marker-fill: #5353FF;third/marker-fill: #0000FF;first/marker-opacity: 0.07;first/marker-width: 55;second/marker-opacity: 0.10;second/marker-width:30;third/marker-opacity: 0.7;third/marker-width:8;}[ rfd_"+selected_year+" <= 100]{first/marker-fill: #9595FF;second/marker-fill: #5353FF;third/marker-fill: #0000FF;first/marker-opacity: 0.05;first/marker-width: 50;second/marker-opacity: 0.08;second/marker-width:30;third/marker-opacity: 0.5;third/marker-width:7;}[ rfd_"+selected_year+" >= 100]{first/marker-fill: #008000;second/marker-fill: #0FFF0F;third/marker-fill: #00E100;first/marker-opacity: 0.05;first/marker-width: 50;second/marker-opacity: 0.08;second/marker-width:30;third/marker-opacity: 0.5;third/marker-width:8;}[ rfd_"+selected_year+" >= 150]{first/marker-fill: #008000;second/marker-fill: #0FFF0F;third/marker-fill: #00E100;first/marker-opacity: 0.055;first/marker-width: 50;second/marker-opacity: 0.085;second/marker-width:30;third/marker-opacity: 0.55;third/marker-width:8;}first/marker-line-width: 0;first/marker-placement: point;first/marker-allow-overlap: true;first/marker-comp-op: lighten;second/marker-line-width: 0;second/marker-placement: point;second/marker-allow-overlap: true;second/marker-comp-op: lighten;third/marker-line-width: 0;third/marker-placement: point;third/marker-allow-overlap: true;third/marker-comp-op: lighten;}"
        //tile_style: "#{{table_name}}{[ rfd_"+selected_year+" <= 100]{first/marker-fill: #F20000;second/marker-fill: #FF5959;third/marker-fill: #FF9B9B}[ rfd_"+ selected_year+" > 100]{first/marker-fill: #008000;second/marker-fill: #0FFF0F;third/marker-fill: #9DFF9D;}first/marker-opacity: 0.01;first/marker-width: 80;first/marker-line-width: 0;first/marker-placement: point;first/marker-allow-overlap: true;first/marker-comp-op: lighten;second/marker-opacity: 0.02;second/marker-width:50;second/marker-line-width: 0;second/marker-placement: point;second/marker-allow-overlap: true;second/marker-comp-op: lighten;third/marker-opacity: 0.04;third/marker-width:20;third/marker-line-width: 0;third/marker-placement: point;third/marker-allow-overlap: true;third/marker-comp-op: lighten;}"
      }
      cartodb.createLayer(map, layer2Url,layer2Options)
        .on('done', function(layer) {
          layer.infowindow.set('template', $('#infowindow_template1').html());
          map.addLayer(layer);
          layers.push(layer);
          layers[2].hide();
        }).on('error', function() {
          //log the error
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

    }//init

    //Actualiza el mapa cambiando las "layers options" al año seleccionado
    function updateQuery0() {
      layers[0].setOptions ({
        query: "SELECT * FROM {{table_name}}",
        tile_style: "#{{table_name}}{[ rfd_" + selected_year + " <= 250]{polygon-fill: #B10026;}[ rfd_" + selected_year + " <= 180]{polygon-fill: #E31A1C;}[ rfd_" + selected_year + " <= 140]{polygon-fill: #FC4E2A;}[ rfd_" + selected_year + " <= 110]{polygon-fill: #FD8D3C;}[ rfd_" + selected_year + " <= 80]{polygon-fill: #FEB24C;}[ rfd_" + selected_year + " <= 70]{polygon-fill: #FED976;}[ rfd_" + selected_year + " <= 60]{polygon-fill: #FFFFB2;}[ rfd_" + selected_year + " <= 45]{polygon-fill: #FFFFCC;}line-color: #FFF;line-opacity: 1;line-width: 1;polygon-opacity: 0.8;}"
      });
    }
    

    //Actualiza el mapa cambiando las "layers options" al año seleccionado
    function updateQuery2() {
      layers[2].setOptions ({
        query: "SELECT * FROM {{table_name}}",
        tile_style: "#{{table_name}}{[ rfd_"+selected_year+" <= 55]{first/marker-fill: #9595FF;second/marker-fill: #5353FF;third/marker-fill: #0000FF;first/marker-opacity: 0.12;first/marker-width: 65;second/marker-opacity: 0.20;second/marker-width:35;third/marker-opacity: 0.9;third/marker-width:9;}[ rfd_"+selected_year+" <= 75]{first/marker-fill: #9595FF;second/marker-fill: #5353FF;third/marker-fill: #0000FF;first/marker-opacity: 0.07;first/marker-width: 55;second/marker-opacity: 0.10;second/marker-width:30;third/marker-opacity: 0.7;third/marker-width:8;}[ rfd_"+selected_year+" <= 100]{first/marker-fill: #9595FF;second/marker-fill: #5353FF;third/marker-fill: #0000FF;first/marker-opacity: 0.05;first/marker-width: 50;second/marker-opacity: 0.08;second/marker-width:30;third/marker-opacity: 0.5;third/marker-width:7;}[ rfd_"+selected_year+" >= 100]{first/marker-fill: #008000;second/marker-fill: #0FFF0F;third/marker-fill: #00E100;first/marker-opacity: 0.05;first/marker-width: 50;second/marker-opacity: 0.08;second/marker-width:30;third/marker-opacity: 0.4;third/marker-width:8;}[ rfd_"+selected_year+" >= 150]{first/marker-fill: #008000;second/marker-fill: #0FFF0F;third/marker-fill: #00E100;first/marker-opacity: 0.06;first/marker-width: 55;second/marker-opacity: 0.1;second/marker-width:35;third/marker-opacity: 0.5;third/marker-width:9;}first/marker-line-width: 0;first/marker-placement: point;first/marker-allow-overlap: true;first/marker-comp-op: lighten;second/marker-line-width: 0;second/marker-placement: point;second/marker-allow-overlap: true;second/marker-comp-op: lighten;third/marker-line-width: 0;third/marker-placement: point;third/marker-allow-overlap: true;third/marker-comp-op: lighten;}"
        //tile_style: "#{{table_name}}{[ rfd_"+selected_year+" <= 100]{first/marker-fill: #F20000;second/marker-fill: #FF5959;third/marker-fill: #FF9B9B}[ rfd_"+ selected_year+" > 100]{first/marker-fill: #008000;second/marker-fill: #0FFF0F;third/marker-fill: #9DFF9D;}first/marker-opacity: 0.01;first/marker-width: 80;first/marker-line-width: 0;first/marker-placement: point;first/marker-allow-overlap: true;first/marker-comp-op: lighten;second/marker-opacity: 0.02;second/marker-width:50;second/marker-line-width: 0;second/marker-placement: point;second/marker-allow-overlap: true;second/marker-comp-op: lighten;third/marker-opacity: 0.04;third/marker-width:20;third/marker-line-width: 0;third/marker-placement: point;third/marker-allow-overlap: true;third/marker-comp-op: lighten;}"
      });
    }


    var timeRetard = 1500;

    function cambiaAño(){
      $('.year').removeClass('selected');
      $('#'+selected_year).addClass('selected'); 
    }

    function draw2008 (){
      selected_year = 2008;
      cambiaAño();
      updateQuery0();
      updateQuery2();
      setTimeout(draw2009, timeRetard);//llama a draw2009 en 1'5 sg a partir de ahora
    }
    function draw2009 (){
      selected_year = 2009;
      cambiaAño();
      updateQuery0();
      updateQuery2();
      setTimeout(draw2010, timeRetard);//
    }
    function draw2010 (){
      selected_year = 2010;
      cambiaAño();
      updateQuery0();
      updateQuery2();
      setTimeout(draw2011, timeRetard);//
    }
    function draw2011 (){
      selected_year = 2011;
      cambiaAño();
      updateQuery0();
      updateQuery2();
      setTimeout(draw2008, timeRetard);
    }

    function animate () {
      setTimeout(draw2008, 2000);//
    }

    function iniciar () {
      selected_year=2008;
      init();

      //setInterval(animate, 10000);
      animate();  
    }

