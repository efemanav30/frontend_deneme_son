import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TasinmazService } from 'src/app/tasinmaz.service';
import { IlService } from '../../services/il.service';
import { IlceService } from '../../services/ilce.service';
import { MahalleService } from '../../services/mahalle.service';
import { Mahalle } from 'src/app/models/mahalle';
import { Ilce } from 'src/app/models/ilce';
import { Il } from 'src/app/models/il';
import { Tasinmaz } from 'src/app/models/tasinmaz';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnChanges, OnInit {
  @Input() tasinmazId: number; // Taşınmaz ID'si giriş olarak alınacak
  updateTasinmazForm: FormGroup;
  iller: Il[] = [];
  ilceler: Ilce[] = [];
  mahalleler: Mahalle[] = [];
  selectedTasinmaz: Tasinmaz;

  constructor(
    private fb: FormBuilder,
    private tasinmazService: TasinmazService,
    private ilService: IlService,
    private ilceService: IlceService,
    private mahalleService: MahalleService
  ) {
    this.updateTasinmazForm = this.fb.group({
      il: ['', Validators.required],
      ilce: ['', Validators.required],
      mahalle: ['', Validators.required],
      ada: ['', Validators.required],
      parsel: ['', Validators.required],
      nitelik: ['', Validators.required],
      koordinatBilgileri: ['', Validators.required],
      adres: ['', Validators.required] // Adres kontrolünü ekleyin
    });
  }

  ngOnInit() {
    this.loadIller();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tasinmazId']) {
      this.loadTasinmaz();
    }
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

  loadTasinmaz() {
    if (this.tasinmazId) {
      this.tasinmazService.getTasinmazById(this.tasinmazId).subscribe((data) => {
        this.selectedTasinmaz = data;
        this.updateTasinmazForm.patchValue({
          il: data.mahalle.ilce.il.id,
          ilce: data.mahalle.ilce.id,
          mahalle: data.mahalle.id,
          ada: data.ada,
          parsel: data.parsel,
          nitelik: data.nitelik,
          koordinatBilgileri: data.koordinatBilgileri,
          adres: data.adres // Adres verisini patchValue ile ekleyin
        });
        this.onIlChange(data.mahalle.ilce.il.id);
        this.onIlceChange(data.mahalle.ilce.id);
      });
    }
  }

  onIlChange(ilId: number) {
    if (ilId > 0) {
      this.ilceService.getIlcelerByIlId(ilId).subscribe(
        (data) => {
          this.ilceler = data;
        },
        (error) => {
          console.error('İlçeler yüklenirken hata oluştu', error);
        }
      );
    }
  }

  onIlceChange(ilceId: number) {
    if (ilceId > 0) {
      this.mahalleService.getMahallelerByIlceId(ilceId).subscribe(
        (data) => {
          this.mahalleler = data;
        },
        (error) => {
          console.error('Mahalleler yüklenirken hata oluştu', error);
        }
      );
    }
  }

  onSubmit() {
    if (this.updateTasinmazForm.valid) {
      const updatedTasinmaz = { ...this.selectedTasinmaz, ...this.updateTasinmazForm.value };
      this.tasinmazService.updateTasinmaz(updatedTasinmaz).subscribe(
        () => {
          console.log('Taşınmaz başarıyla güncellendi:', updatedTasinmaz);
        },
        (error) => {
          console.error('Taşınmaz güncellenirken bir hata oluştu:', error);
        }
      );
    }
  }
}
