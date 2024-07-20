import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import * as ol from 'ol';

import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';
import ScaleLine from 'ol/control/ScaleLine';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import { Tasinmaz } from 'src/app/models/tasinmaz';
import TileImage from 'ol/source/TileImage';
import { environment } from 'src/environments/environment';
declare var google: any;





@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: Map;
  osmLayer: TileLayer<any>;
  osmLayerOpacity: number = 1;
  @Output() coordinateClicked = new EventEmitter<Coordinate>();
  vectorSource: VectorSource;
  vectorLayer: VectorLayer<any>;
  googleLayer: TileLayer<any>; 
  showGoogleMap: boolean = false; 
  mousemove: Coordinate; 
  mousemoves: string;
  mouseX: number;
  showOpenStreetMap: boolean = false;
  mouseY: number;
  isMouseOver: boolean;

  constructor() { }

  ngOnInit() {
    this.vectorSource = new VectorSource();
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({color: 'red'}),
          stroke: new Stroke({
            color: [255,0,0], width: 2
          })
        })
      })
    });
   
    this.osmLayer = new TileLayer({
      source: new OSM(),
      opacity: this.osmLayerOpacity
    });

    this.map = new Map({
      target: 'map',
      layers: [this.osmLayer, this.vectorLayer],
      view: new View({
        center: fromLonLat([35, 39]),
        zoom: 6
      })
    });

    let scale = new ScaleLine({
      units: 'metric',
      bar: true,
      steps: 4,
      text: true,
    });
    this.map.addControl(scale);
    scale.setTarget('scale-bar');

  }

  

  

/*
  toggleGoogleMap() {
    if (!this.showGoogleMap) {
      if (!this.googleLayer) {
        this.googleLayer = new TileLayer({
          source: new ol.source.TileImage({
            url: `https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${environment.googleMapsApiKey}`,
            attributions: '© Google'
          })
        });
      }
      this.map.addLayer(this.googleLayer);
    } else {
      this.map.removeLayer(this.googleLayer);
    }
  }
  
*/

 

  coordinatedClicked() {
    this.map.on('click', (evt) => {
      const coordinate = evt.coordinate; 
        this.vectorSource.clear();
        this.addPoint(coordinate);
        this.coordinateClicked.emit(coordinate); 
        console.log(coordinate); 
    });
  }
  
  addPoint(coordinate: Coordinate) {
    const point = new Point(coordinate);
    const feature = new Feature(point); 
    this.vectorSource.addFeature(feature);
  }
  


  setTasinmazCoordinates(tasinmazlar: Tasinmaz[]) {
    tasinmazlar.forEach(tasinmaz => {
      const coordinate: Coordinate = [tasinmaz.koordinatBilgileri];
      this.addPoint(coordinate);
    });
  }
  popupPage(){
    this.map.on('click', function(evt){
      var feature1 = this.map.ForEachFeatureAtPixel(evt.pixel,
        function(feature1){
          return feature1;

        })
        console.log(feature1);
        

    })
  }

  
}
