import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

declare var mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {

  lat: number;
  lng: number;

  constructor(
    private actRoute: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    let geo: any = this.actRoute.snapshot.paramMap.get('geo');
    geo = geo.substr(4);
    geo = geo.split(',');

    this.lat = Number(geo[0]);
    this.lng = Number(geo[1]);

    console.log('lat', this.lat);
    console.log('lng', this.lng);

  }

  ngAfterViewInit(): void {
    mapboxgl.accessToken = 'pk.eyJ1Ijoid29sZm1vb24iLCJhIjoiY2ttcm10OWJsMDlmYjJ2bzZsNWN5djlnbiJ9.ifuLv79eKFAzU1DMU3yg-A';
    const map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v10',
      center: [this.lng, this.lat],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: 'map',
      antialias: true
    });

    map.on('load', () => {

      map.resize();
      new mapboxgl.Marker()
        .setLngLat([this.lng, this.lat])
        .addTo(map);
      // Insert the layer beneath any symbol layer.
      const layers = map.getStyle().layers;
      let labelLayerId;
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      // The 'building' layer in the Mapbox Streets
      // vector tileset contains building height data
      // from OpenStreetMap.
      map.addLayer(
        {
          'id': 'add-3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#aaa',

            // Use an 'interpolate' expression to
            // add a smooth transition effect to
            // the buildings as the user zooms in.
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        },

        labelLayerId
      );
    });
  }
  
  back() {
    this.navCtrl.navigateForward('/tabs/tab2');
  }
}
