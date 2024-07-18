import { Component } from '@angular/core';
import { IlService } from '../../services/il.service';
import { IlceService } from '../../services/ilce.service';
import { TasinmazService } from 'src/app/tasinmaz.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { Tasinmaz } from 'src/app/models/tasinmaz';
import { Il } from 'src/app/models/il';
import { Ilce } from 'src/app/models/ilce';
import { Mahalle } from 'src/app/models/mahalle';
import { MahalleService } from '../../services/mahalle.service';

import { Router } from "@angular/router";



@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers: [TasinmazService],
})
export class AddComponent {

  newTasinmaz: Tasinmaz = new Tasinmaz();
  mahalleler: Mahalle[] = [];
  iller: Il[] = [];
  ilceler: Ilce[] = [];
  selectedIl: number;
  tasinmazForm: FormGroup;
  selectedIlce: number;
  selectedMahalle: number;
  showSuccessAlert: boolean = false;
  


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
  

  constructor(private ilService: IlService, private ilceService: IlceService, private tasinmazService: TasinmazService, private formBuilder: FormBuilder, private mahalleService: MahalleService,   private router: Router,) { }

  ngOnInit() {
    this.loadIller();
    this.createTasinmazForm();
  }

  loadIller() {
    this.ilService.getIller().subscribe((data) => {
      this.iller = data;
      //sort the iller by alphabetical order
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
      console.log('API Response mahalle:', data); // Gelen veriyi kontrol edin

    }, error => {
      console.error('Mahalleler yüklenirken hata oluştu', error);
    });
  }

  /*add(): void {
    if (this.tasinmazForm.valid) {
      // Formdan gelen verileri newTasinmaz nesnesine atayın
      this.newTasinmaz.il = parseInt(this.tasinmazForm.get("il").value);
      this.newTasinmaz.ilce = parseInt(this.tasinmazForm.get("ilce").value);
      this.newTasinmaz.mahalleId = parseInt(this.tasinmazForm.get("mahalleId").value);
      this.newTasinmaz.ada = this.tasinmazForm.get("ada").value;
      this.newTasinmaz.parsel = this.tasinmazForm.get("parsel").value;
      this.newTasinmaz.nitelik = this.tasinmazForm.get("nitelik").value;
      this.newTasinmaz.koordinatBilgileri = this.tasinmazForm.get("koordinatBilgileri").value;
      
  
      // newTasinmaz nesnesini API'ye gönderin
      this.tasinmazService.addTasinmaz(this.newTasinmaz).subscribe(response => {
        console.log('Taşınmaz başarıyla eklendi');
        // Başarılı ekleme sonrası yapılacak işlemler
      }, error => {
        console.error('Taşınmaz eklenirken bir hata oluştu', error);
      });
    }
  }
  */
  add(): void {
    if (this.tasinmazForm.valid) {
      // Formdan gelen verileri newTasinmaz nesnesine atayın
      this.newTasinmaz.il = parseInt(this.tasinmazForm.get("il").value);
      this.newTasinmaz.ilce = parseInt(this.tasinmazForm.get("ilce").value);
      this.newTasinmaz.mahalleId = parseInt(this.tasinmazForm.get("mahalleId").value);
      this.newTasinmaz.ada = this.tasinmazForm.get("ada").value;
      this.newTasinmaz.parsel = this.tasinmazForm.get("parsel").value;
      this.newTasinmaz.nitelik = this.tasinmazForm.get("nitelik").value;
      this.newTasinmaz.koordinatBilgileri = this.tasinmazForm.get("koordinatBilgileri").value;
      this.newTasinmaz.adres = this.tasinmazForm.get("adres").value;

  
      console.log('New Tasinmaz:', this.newTasinmaz); // Gelen veriyi kontrol edin
  
      // newTasinmaz nesnesini API'ye gönderin
      this.tasinmazService.addTasinmaz(this.newTasinmaz).subscribe(response => {
        console.log('Taşınmaz başarıyla eklendi');
        this.router.navigate(['/table-list']); // Başarılı ekleme sonrası yapılacak işlemler
      }, error => {
        console.error('Taşınmaz eklenirken bir hata oluştu', error);
      });
    }
  }
  
}
