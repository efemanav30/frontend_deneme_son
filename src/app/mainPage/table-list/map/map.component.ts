import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';
import ScaleLine from 'ol/control/ScaleLine';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlTileLayer from 'ol/layer/Tile';
import OlOSM from 'ol/source/OSM';
import OlMousePosition from 'ol/control/MousePosition';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {
  @Input() coordinates: { lon: number, lat: number }[] = []; // Ana sayfadan koordinatları al
  @ViewChild('mousePosition') mousePosition: ElementRef;
  mouseCoordinates: [0,0];
  map: Map;
  vectorSource: VectorSource;
  vectorLayer: VectorLayer<any>;

  constructor() { }

  ngOnInit() {
    this.vectorSource = new VectorSource();
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({ color: 'red' }),
          stroke: new Stroke({
            color: [255, 0, 0], width: 2
          })
        })
      })
    });

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        this.vectorLayer
      ],
      view: new View({
        center: fromLonLat([35, 39]), // Türkiye'nin merkezi koordinatları
        zoom: 6 // Türkiye'yi kapsayacak şekilde yakınlaştırma seviyesi
      })
    });

    let scale = new ScaleLine({
      units: 'metric',
      bar: true,
      steps: 4,
      text: true,
    });
    this.map.addControl(scale);
    scale.setTarget('scale-line');

    const mousePositionControl = new OlMousePosition({
      coordinateFormat: (coord) => {
        // Projeksiyondan coğrafi koordinatlara dönüştürme
        const lonLat = toLonLat(coord);
        return `Lon: ${lonLat[0].toFixed(2)}, Lat: ${lonLat[1].toFixed(2)}`;
      },
      projection: 'EPSG:3857', // OpenLayers'in varsayılan projeksiyonu
      className: 'ol-mouse-position',
      target: document.getElementById('mouse-position')
    });

    this.map.addControl(mousePositionControl);

    this.map.on('pointermove', (evt) => {
      this.mouseCoordinates = evt.mouseCoordinates;
    });
  }


  

  

  ngOnChanges(changes: SimpleChanges) {
    if (changes.coordinates && !changes.coordinates.firstChange) {
      console.log("Coordinates input changed:", this.coordinates);
      this.addSavedCoordinates();
    }
  }

  addSavedCoordinates(): void {
    console.log("Adding coordinates to the map:", this.coordinates);
    if (this.vectorSource) {
      this.vectorSource.clear(); // Önceki noktaları temizle
      // @Input ile alınan koordinatları ekleyin
      this.coordinates.forEach(coord => {
        const transformedCoord = fromLonLat([coord.lon, coord.lat]);
        console.log("Adding point:", transformedCoord);
        const feature = new Feature({
          geometry: new Point(transformedCoord),
        });
        this.vectorSource.addFeature(feature);
      });
    }
  }

  updateMousePosition(lon: number, lat: number): void {
    if (this.mousePosition) {
      this.mousePosition.nativeElement.innerText = `Lon: ${lon.toFixed(6)}, Lat: ${lat.toFixed(6)}`;
    }
  }
}
