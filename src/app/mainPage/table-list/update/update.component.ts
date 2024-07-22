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
  tasinmaz :Tasinmaz;

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
      adres: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadIller();
    this.loadTasinmaz(this.tasinmazId);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tasinmazId']) {
      this.loadTasinmaz(this.tasinmazId);
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

  loadTasinmaz(id: number) {
    if (id) {
      this.tasinmazService.getTasinmazById(id).subscribe((data) => {
        this.selectedTasinmaz = data;
        console.log(data)
        console.log("mahalleid", data.mahalle.id)

        if (data && data.mahalle && data.mahalle.ilce && data.mahalle.ilce.il) {
          this.updateTasinmazForm.patchValue({
            il: data.mahalle.ilce.il.id,
            ilce: data.mahalle.ilce.id,
            mahalle: data.mahalle.id,
            ada: data.ada,
            parsel: data.parsel,
            nitelik: data.nitelik,
            koordinatBilgileri: data.koordinatBilgileri,
            adres: data.adres
          });
          this.onIlChange(data.mahalle.ilce.il.id, data.mahalle.ilce.id);
        } else {
          console.error('Taşınmaz verisi eksik veya hatalı:', data);
        }
      });
    }
  }

  onIlChange(ilId: number, ilceId?: number) {
    if (ilId > 0) {
      this.ilceService.getIlcelerByIlId(ilId).subscribe(
        (data) => {
          this.ilceler = data;
          if (ilceId) {
            this.updateTasinmazForm.patchValue({ ilce: ilceId });
            this.onIlceChange(ilceId);
          }
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
      // Formdan gelen değerler ile yeni Tasinmaz nesnesi oluşturun
      this.tasinmaz = new Tasinmaz(parseInt(
        this.updateTasinmazForm.get("mahalle").value,10), // Mahalle ID'si
        this.updateTasinmazForm.get("ada").value,
        this.updateTasinmazForm.get("parsel").value,
        this.updateTasinmazForm.get("nitelik").value,
        this.updateTasinmazForm.get("koordinatBilgileri").value,
        this.updateTasinmazForm.get("adres").value
      );
  
      // Güncelleme servisine gönderin
      this.tasinmazService.updateTasinmaz(this.tasinmazId,this.tasinmaz).subscribe(
        () => {
          alert('Taşınmaz başarıyla güncellendi.');
          console.log('Taşınmaz başarıyla güncellendi:', this.tasinmaz);
          location.reload();
        },
        (error) => {
          alert('Taşınmaz güncellenirken bir hata oluştu.');

          console.error('Taşınmaz güncellenirken bir hata oluştu:', error);
        }
      );
    } else {
      console.log('Form geçerli değil'); // Formun geçerli olup olmadığını kontrol et
    }
  }
  
}
