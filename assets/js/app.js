/* global L, List, ListFuzzySearch */
/* jshint camelcase: false */

var App, NPMap;

App = {
  activeYear: '1790',
  baseLayers: [{
    attribution: '<a href="http://www.nps.gov/subjects/warof1812/about-disappearing-homelands.htm">About</a> | <a href="https://www.nhgis.org/">NHGIS</a>',
    id: 'nps.50491a69',
    type: 'mapbox',
    date: '1790',
    visible: true
  },{
    attribution: '<a href="http://www.nps.gov/subjects/warof1812/about-disappearing-homelands.htm">About</a> | <a href="https://www.nhgis.org/">NHGIS</a>',
    id: 'nps.329e4aa0',
    type: 'mapbox',
    date: '1810',
    visible: false
  }, {
    attribution: '<a href="http://www.nps.gov/subjects/warof1812/about-disappearing-homelands.htm">About</a> | <a href="https://www.nhgis.org/">NHGIS</a>',
    id: 'nps.ee667450',
    type: 'mapbox',
    date: '1820',
    visible: false
  }, {
    attribution: '<a href="http://www.nps.gov/subjects/warof1812/about-disappearing-homelands.htm">About</a> | <a href="https://www.nhgis.org/">NHGIS</a>',
    id: 'nps.7c373f53',
    type: 'mapbox',
    date: '1840',
    visible: false
  }],
  query: 'year=\'1790\' ORDER BY ST_Area(the_geom) desc',
  list: [],
  searchData: [],
  unitList: {},
  clearInput: function () {
    document.getElementById('search').value = '';
    $('ul.list').append(App.results);
    App.query = 'year=\'' + App.activeYear + '\' ORDER BY ST_Area(the_geom) desc';
    App.setSQL();

    if (NPMap.config.L._popup){
      NPMap.config.L.closePopup();
    }
  },
  drawOutline: function(id) {
    var overlay = NPMap.config.overlays[2] = {
      clickable: false,
      styles: {
        polygon:{
          'fill': '#fff',
          'fill-opacity': 0.1,
          'stroke': '#fff',
          'stroke-opacity': 0.8,
          'stroke-width': 1
        }
      },
      type: 'geojson',
      url: 'https://nps.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT cartodb_id, t, the_geom, ST_Transform(ST_Simplify(the_geom,1000), 4326) as the_geom_webmercator from ai_poly WHERE t = \'' + id + '\' AND year = \'' + App.activeYear + '\' LIMIT 1'
    };
    overlay.L = L.npmap.layer.geojson(overlay).addTo(NPMap.config.L);
    
    setTimeout(function(){
      NPMap.config.L.removeLayer(overlay.L);
      delete overlay.L;
    }, 2000);
  },
  init: function(){
    $('body').append('<div class="year-buttons" id="year-buttons">' +
    '<i class="fa fa-chevron-left"></i>' +
    '<button id="1790" class="date btn btn-default active" href="#" data-content="With the establishment of the independent United States, policy and land recognition of Native Nations began to change." data-html="true" data-toggle="popover" data-trigger="hover" data-placement="top">After the American Revolution</button>' +
    '<button id="1810" class="date btn btn-default" href="#" data-content="As diplomacy failed, tensions among Native Nations and the United States boiled. This would erupt in several parallel conflicts, including the War of 1812." data-html="true" data-toggle="popover" data-trigger="hover" data-placement="top">Before the War</button>' +
    '<button id="1820" class="date btn btn-default" href="#" data-content="Treaties drawn up at the conclusion of War of 1812 hostilities punished both foes and allies. In the name of progress, tribal land was seized." data-html="true" data-toggle="popover" data-trigger="hover" data-placement="top">After the War</button>' +
    '<button id="1840" class="date btn btn-default" href="#" data-content="The 1830 Indian Removal Act, shepherded by War of 1812 general Andrew Jackson, permanently altered the landscape of Native Nations." data-html="true" data-toggle="popover" data-trigger="hover" data-placement="top">After Removal</button>' +
    '<i class="fa fa-chevron-right"></i>' +
    '</div>');

    $('#map').append(
    '<div id="module-legend" class="mobile">' +
      '<table class="legend">' +
        '<thead>'+
        '<th></th><th>Languages</th>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td><img src="http://www.nps.gov/npmap/dev/nero/indian-removal/assets/img/icons/algonquian-legend.jpg" class="legend-icons" alt="Language Legend" style="height:10px;margin:5px"></td><td style="vertical-align:middle;">Algonquian</td></tr><tr>' +
        '<tr><td><img src="http://www.nps.gov/npmap/dev/nero/indian-removal/assets/img/icons/caddoan-legend.jpg" class="legend-icons" alt="Language Legend" style="height:10px;margin:5px"></td><td style="vertical-align:middle;">Caddoan</td></tr><tr>' +
        '<tr><td><img src="http://www.nps.gov/npmap/dev/nero/indian-removal/assets/img/icons/iroquoian-legend.jpg" class="legend-icons" alt="Language Legend" style="height:10px;margin:5px"></td><td style="vertical-align:middle;padding-right:5px;">Iroquoian</td></tr><tr>' +
        '<tr><td><img src="http://www.nps.gov/npmap/dev/nero/indian-removal/assets/img/icons/muskhogean-legend.jpg" class="legend-icons" alt="Language Legend" style="height:10px;margin:5px"></td><td style="vertical-align:middle;">Muskhogean</td></tr><tr>' +
        '<tr><td><img src="http://www.nps.gov/npmap/dev/nero/indian-removal/assets/img/icons/siouan-legend.jpg" class="legend-icons" alt="Language Legend" style="height:10px;margin:5px"></td><td style="vertical-align:middle;padding-right:5px;">Siouan</td></tr><tr>' +
        '<tr><td><img src="http://www.nps.gov/npmap/dev/nero/indian-removal/assets/img/icons/tunican-legend.jpg" class="legend-icons" alt="Language Legend" style="height:10px;margin:5px"></td><td style="vertical-align:middle;padding-right:5px;">Tunican</td></tr><tr>' +
        '</tbody>' +
      '</table>' +
    '</div>');
  },
  index: function() {
    switch (App.activeYear) {
    case '1790':
      return 0;
    case '1810':
      return 1;
    case '1820':
      return 2;
    case '1840':
      return 3;
    default:
      return 0;
    }
  },
  listSetUp: function() {
    var html = '',
      values = App.searchData;

    App.results = '';

    for (var i = 0; i < values.length; i++){
      if (values[i].year === App.activeYear){
        var language = values[i].language;

        html += '' +
          '<li class="filtering ' + language + '" data-content="' + values[i].lat + ',' + values[i].lng + '" id="' + values[i].t + '">' +
            '<p class="tribe" data-content="' + values[i].tribe + '">' + values[i].tribe + '</p>' +
            '<span class="d" style="display:none" data-content="' + values[i].d + '"></span>' +
            '<span class="language" style="display:none">' + language + '</span>' +
            '<span class="region" style="display:none">' + values[i].region + '</span>' +
            '<span class="geo" style="display:none">' + values[i].geo + '</span>' +
            '<span class="state" style="display:none">' + values[i].state + '</span>' +
            '<span class="related_group" style="display:none">' + values[i].related_group + '</span>' +
            '<span class="other" style="display:none">' + values[i].other + '</span>' +
          '</li>' +
        '';
      }
    }
    App.results = html;

    $('ul.list').append(html);

    for (var k = 0; k < $('li.filtering').length; k++){
      L.DomEvent.addListener($('li.filtering')[k], 'click', App.viewingMarkers);
    }

    App.unitList = new List('unit-list', {
      plugins: [
        new ListFuzzySearch()
      ],
      valueNames: [
        'd',
        'tribe',
        'language',
        'geo',
        'region',
        'state',
        'related_group',
        'other'
      ]
    });
    App.unitList.sort('tribe', { order: 'asc' });

    App.unitList.on('searchComplete', function(e) {
      var i = 0,
        item = e.matchingItems;

      App.list = [];
     
      for (i;i < item.length; i++) {
        App.list.push(item[i].elm.id);
      }
      App.searchTribes();
    });
  },
  popup: function() {
    var popup = NPMap.config.L._popup;

    if (popup) {
      var lat = popup._latlng.lat,
      lng = popup._latlng.lng;

      L.npmap.util._.reqwest({
        jsonpCallbackName: 'c',
        success: function(response) {
          if (response.rows === []) {
            return;
          } else {
            var html = '<div class="title">Nations</div><div class="content"><div class="description"><ul>',
              i,
              tribeList = response;

            for (i = 0;i < tribeList.rows.length; i++) {
              var description = tribeList.rows[i].d,
              tribe =  tribeList.rows[i].tribe;
              if (tribeList.rows.length === 1) {
                html = '<div class="title">' + tribe +'</div><div class="content"><div class="description">' + description;
      
                popup.setContent(html + '</div><div class="actions"><a onclick="App.popup();"><i class="fa fa-angle-double-left"></i> Back</a>');
              } else {
                html += '<li><a id="'+ tribe + '" data-content="' + description + '" onclick="App.popupInformation(this);">' + tribe + '</a></li>';
              }
            }
            html += '</ul>';
       
            popup.setContent(html + '</div></div>');
            return popup;
          }
        },
        error: function(){
          return;
        },
        type: 'jsonp',
        url: 'https://nps.cartodb.com/api/v2/sql?q=SELECT tribe,d FROM ai_poly WHERE year = \'' + App.activeYear + '\' AND the_geom %26%26 ST_PointFromText(%27POINT('+ lng +'+'+ lat +')%27) AND St_intersects(the_geom, St_setsrid(St_pointfromtext(%27POINT('+ lng +'+'+ lat +')%27),4326))'
      });
    }
  },
  popupInformation: function(me) {
    var tribe = me.id,
      popup = NPMap.config.L._popup,
      html = '<div class="title">' + tribe +'</div><div class="content"><div class="description">' + me.dataset.content;
    
    popup.setContent(html + '</div><div class="actions"><a onclick="App.popup();"><i class="fa fa-angle-double-left"></i> Back</a>');

    return popup;
  },
  searchingThrough: function() {
    for (var j = 0; j < $('li.filtering').length; j++){
      var values = App.searchData;
      for (var i = 0; i < values.length; i++){
        if (values[i].year === App.activeYear){
          if (values[i].t === $('li.filtering')[j].id){
            $('li.filtering')[j].children[1].dataset.content = values[i].d;
            $('li.filtering')[j].dataset.content = values[i].lat + ',' + values[i].lng;
          }
        }
      }
    }

    for (var k = 0; k < $('li.filtering').length; k++){
      App.list.push($('li.filtering')[k].id);
    }
    App.searchTribes();
  },
  searchTribes: function() {
    var additional = '',
      input = document.getElementById('search').value,
      query = '';

    if (NPMap.config.L._popup){
      NPMap.config.L.closePopup();
    }

    query += 'year = \'' + App.activeYear + '\' AND ';

    if (input.length === 0) {
      query = query.slice(0, query.length - 5) + '';
    } else {
      query += '(';
      for (var j=0; j < App.list.length; j++){
        var t = App.list[j];
        additional += 't=\'' + t + '\' OR ';
      }
      query = query + additional.slice(0, additional.length - 4) + ') ';
    }

    if (query === 'year = \'' + App.activeYear + '\' AND () '){
      query = '1 = 0 ';
    }

    App.query = query + 'ORDER BY ST_Area(the_geom) desc';
    App.setSQL();
  },
  setSQL: function(){
    var polygons = NPMap.config.overlays[0],
      points = NPMap.config.overlays[1];

    NPMap.config.L.removeLayer(polygons.L);
    NPMap.config.L.removeLayer(points.L);
    polygons.sql = 'SELECT * FROM ai_poly WHERE ' + App.query;
    points.sql = 'SELECT * FROM ai_points WHERE ' + App.query;
    polygons.L = L.npmap.layer.cartodb(polygons).addTo(NPMap.config.L);
    points.L = L.npmap.layer.cartodb(points).addTo(NPMap.config.L);
  },
  viewingMarkers: function() {
    var latLng = L.latLng(Number(this.dataset.content.split(',')[0]), Number(this.dataset.content.split(',')[1])),
    popup = '<div class="title" style="width:250px;">' + this.childNodes[0].dataset.content +'</div><div class="content"><div class="description">' + this.childNodes[1].dataset.content;
    
    NPMap.config.L.setView(latLng, 6);
    NPMap.config.L.openPopup(popup,latLng);
    App.drawOutline(this.id);
  }
};


NPMap = {
  baseLayers: [
    App.baseLayers[0]
  ],
  center: {
    lat: 39.842,
    lng: -98.305
  },
  description: 'Native Nations, Land, and the Legacy of the War of 1812',
  div: 'map',
  homeControl: {
    position: 'topright'
  },
  hooks: {
    preinit: function(callback){
      L.npmap.util._.appendJsFile([
        'http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js',
        'http://www.nps.gov/npmap/dev/nero/indian-removal/assets/js/libs/list.js',
        'http://www.nps.gov/npmap/dev/nero/indian-removal/assets/js/libs/list.fuzzysearch.js',
      ], function(){
        L.npmap.util._.appendJsFile([
          'http://www.nps.gov/lib/bootstrap/3.3.2/js/nps-bootstrap.min.js'
        ], function() {
          L.npmap.util._.appendCssFile([
            'http://www.nps.gov/npmap/dev/nero/indian-removal/assets/css/app.css',
            'http://www.nps.gov/lib/bootstrap/3.3.2/css/nps-bootstrap.min.css',
            'http://netdna.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css'
          ], function() {
            L.npmap.util._.reqwest({
              jsonpCallbackName: 'c',
              success: function(response) {
                App.searchData = response.rows;
                App.init();
                callback();
              },
              type: 'jsonp',
              url: 'https://nps.cartodb.com/api/v2/sql?q=SELECT+ai_poly.lat,ai_poly.lng,ai_poly.d,ai_poly.t,ai_poly.tribe,ai_poly.geo,ai_poly.language,ai_poly.region,ai_poly.related_group,ai_poly.state,ai_poly.other,ai_poly.year+from+ai_poly+UNION+ALL+SELECT+ai_points.lat,ai_points.lng,ai_points.d,ai_points.t,ai_points.tribe,ai_points.geo,ai_points.language,ai_points.region,ai_points.related_group,ai_points.state,ai_points.other,ai_points.year+from+ai_points'
            });
          });
        });
      });
    },
    init: function(callback) {
      var ButtonControl,
      clear,
      module = document.getElementById('container');

      module.innerHTML =
        '<ul class="nav nav-tabs">' +
            '<li class="nav active"><a href="#History" data-toggle="tab">Background</a></li>' +
            '<li class="nav"><a href="#Nations" data-toggle="tab">Nations</a></li>' +
            '<li class="nav"><a href="#Legend" data-toggle="tab">Legacy</a></li>' +
        '</ul>' +
        '<div class="tab-content">' +
            '<div class="tab-pane active" id="History"></div>' +
            '<div class="tab-pane" id="Nations"></div>' +
            '<div class="tab-pane" id="Legend"></div>' +
        '</div>';

      document.getElementById('History').innerHTML = '' +
      '<p>Dozens of Native Nations, from the Great Lakes to the Gulf of Mexico, experienced the War of 1812 as a chapter in a centuries-long struggle to defend homelands against Euro-American encroachment. While the Anglo-American conflict ended in 1815, the story continued for many tribal communities: forced to make difficult choices to determine their futures.<p>' +
      '<p>What would you do if someone tried to take your home? Would you fight to stay, or follow orders to maintain peace? Dozens of Native Nations individually faced these questions. Some stayed and some left-- all at great cost. The effects of these choices continue shaping communities still today.</p>' +
      '<p>These maps help tell a shifting story of the relationships among the United States government and some of the Native Nations involved in the conflict. The land mapped represents how the United States government defined the borders of its neighbors, as documented through treaties. While this does not necessarily show where tribal people actually lived, it paints a portrait of inequality, hardship, and sacrifice which often characterizes the American Indian perspective of the War of 1812 and its aftermath.</p>';

      document.getElementById('Nations').innerHTML = '' +
       '<div id="unit-list">' +
          '<input type="text" class="fuzzy-search" id="search" placeholder="Search for ...">' +
          '<button><i class="fa fa-times" id="clear"></i></button>'+
          '<a id="keywordSearch" class="btn btn-circle" href="#" data-html="true" data-toggle="popover" data-container="body" data-trigger="hover" data-placement="bottom"' +
          'data-content="<p><strong>Languages:</strong> Algonquian, Caddoan, Iroquoian, Muskhogean, Siouan, Tunican</p>' +
          '<p><strong>Geographic Groups:</strong> Appalachian Foothills, Great Lakes Plains, Hudson Lowlands, Lower Mississippi Delta, Northern Forests, Southeast & Coastal Plain</p>' +
          '<p><strong>Geographic Regions:</strong> Northeast, Midwest, Southeast</p>' +
          '<p><strong>Related Groups:</strong> Caddoan, Catawaba, Cherokee, Chickasaw, Chippewa, Chitimacha, Choctaw, Coushatta, Creek, Iroquoian, Iroquois, Mahican, Menominee, Ottawa, Potawatomi, Quapaw, Shawnee, Seminole, Tunica, Tuscarora, Winnebago, Wyandot</p>' +
          '<p><strong>Other:</strong> Algonquian, Kadohadacho, Koasati, Odawa, Ojibwe, Siouan</p>' +
          '<p><strong>States:</strong> Alabama, Arkansas, Florida, Georgia, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Michigan, Minnesota, Mississippi, Missouri, Nebraska, New York, North Carolina, Ohio, Oklahoma, Tennessee, Wisconsin</p>"><i class="fa fa-question"></i></a>' +
          '<p>Filter through nations with keywords. See question mark for keywords.</p>' +
          '<ul class="list" id="list"">' +
          '</ul>' +
        '</div>';

      document.getElementById('Legend').innerHTML = '' +
      '<p>While frontier conflicts among Americans and American Indians persisted for years prior to the War of 1812, it was in its aftermath that relationships among sovereign nations began quickly deteriorating. Public opinion called diverse Native Nations, regardless of alliances during the war, a collective enemy. This popular perspective was championed by an even more popular figure-- Andrew Jackson. Widely celebrated as a "hero" of the War of 1812 and the Creek War, Jackson was easily elected president and assumed office March 4, 1829. Just over a year later, public support for displacing Native Nations became codified by law.</p>' +
      '<p>The Indian Removal Act of 1830 gave the president the authority to "extinguish" American Indian claims to land, and "exchange" those lands for territory "west of the river Mississippi." The final maps in this study represent the period from c. 1840 to 1865. By 1840 many Nations were displaced to "Indian territory" in present-day Oklahoma, however resistance and even armed rebellion continued for decades.</p>' +
      '<p>These maps tell a story of loss, but they also celebrate a tradition of resilience. The Nations that these maps represent continue to exit today as active, <a href=" http://www.nps.gov/subjects/warof1812/Tribal-Partners.htm">thriving communities</a> who continue to live with the legacies of a war that ended more than 200 years ago.</p>' +
      '';

      clear = document.getElementById('clear');
      App.listSetUp();
      L.DomEvent.addListener(clear, 'click', App.clearInput);

      if (NPMap.config.L._popup){
        L.DomEvent.addListener(module, 'click', NPMap.config.L.closePopup());
      }

      $('#keywordSearch').on('click',function(){
        $('#keywordSearch').popover('show');
      });

      ButtonControl = L.Control.extend({
        options: {
          position: 'bottomleft'
        },
        onAdd: function(map) {
          this._backward = $('.fa-chevron-left')[0];
          this._buttons = $('.date.btn');
          this._container = $('#year-buttons')[0];
          this._forward = $('.fa-chevron-right')[0];

          for (var i = 0; i < this._buttons.length; i++) {
            L.DomEvent.addListener(this._buttons[i], 'click', this._handleClick, this);
          }

          L.DomEvent
            .on(this._backward, 'click', this._stepBackward, this)
            .on(this._container, 'click', L.DomEvent.preventDefault)
            .on(this._container, 'click', L.DomEvent.stopPropagation)
            .on(this._container, 'dblclick', L.DomEvent.preventDefault)
            .on(this._container, 'dblclick', L.DomEvent.stopPropagation)
            .on(this._forward, 'click', this._stepForward, this);

          this._container.style.display = 'block';
          this._map = map;

          return this._container;
        },
        _getActiveButtonIndex: function() {
          var active = -1;

          for (var i = 0; i < this._buttons.length; i++) {
            var button = this._buttons[i];
            if ($(button).hasClass('active')) {
              active = i;
              break;
            }
          }
          return active;
        },
        _handleClick: function(e) {
          var clickedID = e.target.id,
            i = 0;

          for (i = 0; i < this._buttons.length; i++) {
            var button = this._buttons[i].id;

            if (clickedID === button) {
              L.DomUtil.addClass(this._buttons[i], 'active');
              $(this._buttons[i]).popover('show');
              App.activeYear = button;
              App.searchingThrough();
            } else {
              L.DomUtil.removeClass(this._buttons[i], 'active');
              $(this._buttons[i]).popover('hide');
            }
          }

          if (NPMap.config.L._popup){
            NPMap.config.L.closePopup();
          }
          NPMap.config.L.removeLayer(NPMap.config.baseLayers[0].L);
          NPMap.config.baseLayers[0] = App.baseLayers[App.index()];
          NPMap.config.baseLayers[0].L = L.npmap.layer.mapbox(NPMap.config.baseLayers[0]).addTo(NPMap.config.L);
        },
        _stepBackward: function() {
          var activeIndex = this._getActiveButtonIndex(),
            index = -1;

          if (activeIndex === 0) {
            index = 3;
          } else {
            index = activeIndex - 1;
          }

          $(this._buttons[index]).trigger('click');
        },
        _stepForward: function() {
          var activeIndex = this._getActiveButtonIndex(),
            index = -1;

          if (activeIndex === 3) {
            index = 0;
          } else {
            index = activeIndex + 1;
          }

          $(this._buttons[index]).trigger('click');
        }
      });

      new ButtonControl().addTo(NPMap.config.L);
      callback();
    }
  },
  modules: [{
    icon: 'info',
    content: '<div id="container"></div>',
    title: 'Information',
    type: 'custom',
    visible: true,
    width: 300
  }],
  overlays: [{
    name: 'Polygons',
    cartocss: '#ai_poly{' +
   '::fill{' +
      'comp-op: multiply;' +
      'polygon-opacity:0.6;' +
      '[language = "Algonquian"]{polygon-fill: mix(#9C2F51,rgb(223,203,172),55);}' +
      '[language = "Caddoan"]{polygon-fill: mix(#3B4354,rgb(223,203,172),70);}' +
      '[language = "Iroquoian"]{polygon-fill: mix(#00515C,rgb(223,203,172),55);}' +
      '[language = "Muskhogean"]{polygon-fill: mix(#B78E3F,rgb(223,203,172),60);}' +
      '[language = "Siouan"]{polygon-fill: mix(#D95B43,rgb(223,203,172),80);}' +
      '[language = "Tunican"]{polygon-fill: mix(#88619e,rgb(223,203,172),80);}' +
     '}' +
   '::outerband{' +
      '[language = "Algonquian"]{line-color:mix(#9C2F51,rgb(223,203,172),90);}' +
      '[language = "Caddoan"]{line-color: mix(#3B4354,rgb(223,203,172),60);}' +
      '[language = "Iroquoian"]{line-color:mix(#00515C,rgb(223,203,172),60);}' +
      '[language = "Muskhogean"]{line-color:mix(#B78E3F,rgb(223,203,172),90);}' +
      '[language = "Siouan"]{line-color: mix(#D95B43,rgb(223,203,172),90);}' +
      '[language = "Tunican"]{line-color:mix(#88619e,rgb(223,203,172),80);}' +
      'line-offset: -1;' +
      'image-filters: agg-stack-blur(1,1);' +
      'line-join: round;' +
      'line-cap: round;' +
      'opacity: 0.6;' +
      '[zoom>=5]{line-width:0.5; image-filters: agg-stack-blur(2,2);}' +
      '[zoom>=6]{line-width: 1.5;}' +
      '[zoom>=7]{line-width: 2; image-filters: agg-stack-blur(3,3);}' +
     '}' +
   '}',
    popup: function() {
      setTimeout(function() { App.popup(); }, 500);
      return 'Loading';
    },
    table: 'ai_poly',
    type: 'cartodb',
    user: 'nps',
    sql: 'Select * from nps.ai_poly WHERE ' + App.query
  },{
    name: 'Points',
    popup: {
      description: '{{d}}',
      title: '{{tribe}}'
    },
    cartocss: '' +
      '#ai_points{' +
      'point-allow-overlap: true;' +
      '[language = "Algonquian"]{ point-file: url(http://www.nps.gov/npmap/dev/nero/indian-removal/assets/img/icons/algonquian.svg); }' +
      '[language = "Caddoan"]{ point-file: url(http://www.nps.gov/npmap/dev/nero/indian-removal/assets/img/icons/caddoan.svg); }' +
      '[language = "Iroquoian"]{  point-file: url(http://www.nps.gov/npmap/dev/nero/indian-removal/assets/img/icons/iroquoian.svg); }' +
      '[language = "Muskhogean"]{  point-file: url(http://www.nps.gov/npmap/dev/nero/indian-removal/assets/img/icons/muskhogean.svg); }' +
      '[language = "Siouan"] {  point-file: url(http://www.nps.gov/npmap/dev/nero/indian-removal/assets/img/icons/siouan.svg); }' +
      '[language = "Tunican"] {  point-file: url(http://www.nps.gov/npmap/dev/nero/indian-removal/assets/img/icons/tunican.svg); }' +
      '[zoom=4] { point-transform: "scale(0.75)";}' +
      '[zoom=5] { point-transform: "scale(1)";}' +
      '[zoom=6] { point-transform: "scale(1.25)";}' +
      '[zoom=7] { point-transform: "scale(1.5)";}' +
      '[zoom=8] { point-transform: "scale(1.75)";}' +
      '[zoom=9] { point-transform: "scale(2)";}' +
   '}',
    table: 'ai_points',
    type: 'cartodb',
    user: 'nps',
    sql: 'SELECT * FROM nps.ai_points WHERE ' + App.query,
    events: {
      type: 'ready'
    }
  }],
  maxZoom: 9,
  minZoom: 4,
  smallzoomControl: {
    position: 'topright'
  },
  title: 'Disappearing Homelands',
  zoom: 4
};

(function() {
  var s = document.createElement('script');
  s.src = 'http://www.nps.gov/lib/npmap.js/2.0.0/npmap-bootstrap.min.js';
  document.body.appendChild(s);
})();
