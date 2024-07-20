import { Component, ViewChild, ElementRef } from '@angular/core';
import { IlService } from '../../services/il.service';
import { IlceService } from '../../services/ilce.service';
import { TasinmazService } from 'src/app/tasinmaz.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Tasinmaz } from 'src/app/models/tasinmaz';
import { Il } from 'src/app/models/il';
import { Ilce } from 'src/app/models/ilce';
import { Mahalle } from 'src/app/models/mahalle';
import { MahalleService } from '../../services/mahalle.service';
import { Router } from "@angular/router";
import { Map, View } from 'ol';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import { Coordinate } from 'ol/coordinate';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers: [TasinmazService],
})
export class AddComponent {
  showMap = false;
  selectedCoordinate: { lon: number, lat: number } | null = null;
  @ViewChild('mapContainer') mapContainer: ElementRef;
  newTasinmaz: Tasinmaz;
  mahalleler: Mahalle[] = [];
  iller: Il[] = [];
  ilceler: Ilce[] = [];
  selectedIl: number;
  tasinmazForm: FormGroup;
  selectedIlce: number;
  selectedMahalle: number;
  showSuccessAlert: boolean = false;
  map: any;
  vectorSource: any;

  constructor(private ilService: IlService, private ilceService: IlceService, private tasinmazService: TasinmazService, private formBuilder: FormBuilder, private mahalleService: MahalleService, private router: Router) {
    this.createTasinmazForm();
  }

  ngOnInit() {
    this.loadIller();
  }

  createTasinmazForm() {
    this.tasinmazForm = this.formBuilder.group({
      il: ['', Validators.required],
      ilce: ['', Validators.required],
      mahalleId: ['', Validators.required],
      ada: ['', Validators.required],
      parsel: ['', Validators.required],
      nitelik: ['', Validators.required],
      koordinatBilgileri: ['', Validators.required],
      adres: ['', Validators.required],
    });
  }

  loadIller() {
    this.ilService.getIller().subscribe((data) => {
      this.iller = data;
    }, (error) => {
      console.error('İller yüklenirken hata oluştu', error);
    });
  }

  onIlChange(ilId: number): void {
    this.selectedIl = ilId;
    this.loadIlceler(ilId);
  }

  loadIlceler(ilId: number): void {
    this.ilceService.getIlcelerByIlId(ilId).subscribe(data => {
      this.ilceler = data;
    }, error => {
      console.error('İlçeler yüklenirken hata oluştu', error);
    });
  }

  onIlceChange(ilceId: number): void {
    this.selectedIlce = ilceId;
    this.loadMahalleler(ilceId);
  }

  loadMahalleler(ilceId: number): void {
    this.mahalleService.getMahallelerByIlceId(ilceId).subscribe(data => {
      this.mahalleler = data;
      console.log('API Response mahalle:', data);
    }, error => {
      console.error('Mahalleler yüklenirken hata oluştu', error);
    });
  }

  openMap(): void {
    this.showMap = true;
    setTimeout(() => this.initializeMap(), 0);
  }

  initializeMap(): void {
    if (this.map) {
      this.map.setTarget(this.mapContainer.nativeElement);
    } else {
      this.vectorSource = new VectorSource();
      this.map = new Map({
        target: this.mapContainer.nativeElement,
        layers: [
          new Tile({
            source: new OSM()
          }),
          new VectorLayer({
            source: this.vectorSource,
            style: new Style({
              image: new CircleStyle({
                radius: 7,
                fill: new Fill({ color: 'red' }),
                stroke: new Stroke({
                  color: 'black',
                  width: 2,
                }),
              }),
            }),
          }),
        ],
        view: new View({
          center: fromLonLat([29.15, 36.6]), // Başlangıç merkezi
          zoom: 14 // Başlangıç zoom seviyesi
        })
      });

      this.map.on('click', (event) => {
        const coords = toLonLat(event.coordinate);
        this.onCoordinateSelected([coords[1], coords[0]]); // Enlem ve boylamı doğru sırayla kullanıyoruz
      });
    }
    this.mapContainer.nativeElement.style.display = 'block';
    this.map.updateSize(); // Harita boyutunu güncelle
  }

  onCoordinateSelected(coords: Coordinate): void {
    this.selectedCoordinate = {
      lon: coords[1], // Lon ve Lat sıralamasını düzeltiyoruz
      lat: coords[0],
    };
    this.tasinmazForm.patchValue({
      koordinatBilgileri: `${this.selectedCoordinate.lat.toFixed(6)}, ${this.selectedCoordinate.lon.toFixed(6)}`
    });

    const feature = new Feature({
      geometry: new Point(fromLonLat([this.selectedCoordinate.lon, this.selectedCoordinate.lat])),
    });
    this.vectorSource.clear();
    this.vectorSource.addFeature(feature);

    this.showMap = false;
  }

  add(): void {
    if (this.tasinmazForm.valid) {
      this.newTasinmaz = new Tasinmaz(
        parseInt(this.tasinmazForm.get("mahalleId").value),
        this.tasinmazForm.get("ada").value,
        this.tasinmazForm.get("parsel").value,
        this.tasinmazForm.get("nitelik").value,
        this.tasinmazForm.get("koordinatBilgileri").value,
        this.tasinmazForm.get("adres").value
      );
  
      console.log('New Tasinmaz:', this.newTasinmaz);
  
      this.tasinmazService.addTasinmaz(this.newTasinmaz).subscribe(response => {
        console.log('Taşınmaz başarıyla eklendi');
        location.reload();
        this.router.navigate(['/table-list']);
      }, error => {
        console.error('Taşınmaz eklenirken bir hata oluştu', error);
      });
    }
  }
}
