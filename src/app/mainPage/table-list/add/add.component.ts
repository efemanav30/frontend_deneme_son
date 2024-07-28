import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TasinmazService } from 'src/app/tasinmaz.service';
import { IlService } from '../../services/il.service';
import { IlceService } from '../../services/ilce.service';
import { MahalleService } from '../../services/mahalle.service';
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
import { AuthService } from '../../services/auth.service';
import { LogService } from '../../services/log.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Tasinmaz } from 'src/app/models/tasinmaz';
import { Log } from 'src/app/models/log';
import { Il } from 'src/app/models/il';
import { Ilce } from 'src/app/models/ilce';
import { Mahalle } from 'src/app/models/mahalle';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers: [TasinmazService],
})
export class AddComponent implements OnInit {
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
  isSubmitted = false;

  constructor(
    private ilService: IlService,
    private ilceService: IlceService,
    private tasinmazService: TasinmazService,
    private formBuilder: FormBuilder,
    private mahalleService: MahalleService,
    private authService: AuthService,
    private logService: LogService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal
  ) {
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
    this.ilService.getIller().subscribe(
      (data) => {
        this.iller = data;
      },
      (error) => {
        console.error('İller yüklenirken hata oluştu', error);
      }
    );
  }

  onIlChange(ilId: number): void {
    this.selectedIl = ilId;
    this.loadIlceler(ilId);
  }

  loadIlceler(ilId: number): void {
    this.ilceService.getIlcelerByIlId(ilId).subscribe(
      (data) => {
        this.ilceler = data;
      },
      (error) => {
        console.error('İlçeler yüklenirken hata oluştu', error);
      }
    );
  }

  onIlceChange(ilceId: number): void {
    this.selectedIlce = ilceId;
    this.loadMahalleler(ilceId);
  }

  loadMahalleler(ilceId: number): void {
    this.mahalleService.getMahallelerByIlceId(ilceId).subscribe(
      (data) => {
        this.mahalleler = data;
        console.log('API Response mahalle:', data);
      },
      (error) => {
        console.error('Mahalleler yüklenirken hata oluştu', error);
      }
    );
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
            source: new OSM(),
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
          center: fromLonLat([35, 39]),
          zoom: 5,
        }),
      });

      this.map.on('click', (event) => {
        const coords = toLonLat(event.coordinate);
        this.onCoordinateSelected([coords[1], coords[0]]);
      });
    }
    this.mapContainer.nativeElement.style.display = 'block';
    this.map.updateSize();
  }

  onCoordinateSelected(coords: Coordinate): void {
    this.selectedCoordinate = {
      lon: coords[1],
      lat: coords[0],
    };
    this.tasinmazForm.patchValue({
      koordinatBilgileri: `${this.selectedCoordinate.lat.toFixed(6)}, ${this.selectedCoordinate.lon.toFixed(6)}`,
    });

    const feature = new Feature({
      geometry: new Point(fromLonLat([this.selectedCoordinate.lon, this.selectedCoordinate.lat])),
    });
    this.vectorSource.clear();
    this.vectorSource.addFeature(feature);

    this.showMap = false;
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.tasinmazForm.valid) {
      if (confirm('Bu taşınmazı eklemek istediğinize emin misiniz?')) {
        const a = this.tasinmazForm.value;
        const id = this.authService.getCurrentUserId();
        this.newTasinmaz = new Tasinmaz(
          parseInt(a.mahalleId, 10),
          a.ada,
          a.parsel,
          a.nitelik,
          a.koordinatBilgileri,
          a.adres,
          id
        );

        console.log('New Tasinmaz:', this.newTasinmaz);

        this.tasinmazService.addTasinmaz(this.newTasinmaz).subscribe(
          (response) => {
            this.toastr.success('Taşınmaz başarıyla eklendi.');
            console.log('Taşınmaz başarıyla eklendi');
            this.activeModal.close('save');
            location.reload();
          },
          (error) => {
            this.toastr.error('Taşınmaz eklenirken bir hata oluştu.');
            console.error('Taşınmaz eklenirken bir hata oluştu', error);
            this.logError(`Taşınmaz eklenirken hata oluştu: ${error.message}`);
          }
        );
      }
    } else {
      this.markFormGroupTouched(this.tasinmazForm);
      this.toastr.error('Lütfen tüm gerekli alanları doldurun.');
      this.logError('Gerekli alanlar doldurulmadı.');
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  logError(message: string) {
    const log: Log = {
      kullaniciId: this.getUserId(),
      durum: 'Başarısız',
      islemTip: 'Taşınmaz Ekleme',
      aciklama: message,
      tarihveSaat: new Date(),
      kullaniciTip: 'Admin',
    };

    this.logService.add(log).subscribe(
      () => {
        console.log('Hata loglandı.');
      },
      (error) => {
        console.error('Loglama sırasında hata oluştu:', error);
      }
    );
  }

  getUserId(): number {
    return 1;
  }

  dismissModal() {
    this.toastr.warning('Ekleme işleminden vazgeçildi.');
    this.activeModal.dismiss('Cross click');
  }
}
