import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import OlMousePosition from 'ol/control/MousePosition';
import ScaleLine from 'ol/control/ScaleLine';
import { Coordinate } from 'ol/coordinate';
import {  toLonLat } from 'ol/proj';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {
  @Input() coordinates: { lon: number, lat: number }[] = []; // Ana sayfadan koordinatları al
  @ViewChild('mousePosition') mousePosition: ElementRef;
  map: Map;
  vectorSource: VectorSource;
  vectorLayer: VectorLayer<any>;
  osmLayer: TileLayer;
  googleLayer: TileLayer;

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

    this.osmLayer = new TileLayer({
      source: new OSM(),
    });

    this.googleLayer = new TileLayer({
      source: new XYZ({
        url: 'http://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
      }),
      visible: false, // Başlangıçta Google Maps katmanı görünmez
    });

    this.map = new Map({
      target: 'map',
      layers: [
        this.osmLayer,
        this.googleLayer,
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
        return `${coord[0].toFixed(5)},${coord[1].toFixed(5)}`;
      },
      projection: 'EPSG:4326', // OpenLayers'in varsayılan projeksiyonu
      className: 'ol-mouse-position',
      target: document.getElementById('mouse-position')
    });

    this.map.addControl(mousePositionControl);

    this.map.on('pointermove', (evt) => {
      const coordinates = evt.coordinate;
      this.updateMousePosition(coordinates[0], coordinates[1]);
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

  updateMousePosition(x: number, y: number): void {
    // Ekran koordinatlarını harita koordinatlarına çevir
    const mapCoordinate: Coordinate = this.map.getCoordinateFromPixel([x, y]);
  
    // Harita koordinatlarını (EPSG:3857) coğrafi koordinatlara (enlem, boylam) çevir
    const lonLatCoordinate: Coordinate = toLonLat(mapCoordinate);
  
    if (this.mousePosition) {
      this.mousePosition.nativeElement.innerText = `Enlem: ${lonLatCoordinate[1].toFixed(6)}, Boylam: ${lonLatCoordinate[0].toFixed(6)}`;
    }
  }

  toggleLayer(layer: string): void {
    if (layer === 'osm') {
      this.osmLayer.setVisible(true);
      this.googleLayer.setVisible(false);
    } else if (layer === 'google') {
      this.osmLayer.setVisible(false);
      this.googleLayer.setVisible(true);
    }
  }

  changeOpacity(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const opacity = Number(value);

    this.osmLayer.setOpacity(opacity);
    this.googleLayer.setOpacity(opacity);
  }
}
