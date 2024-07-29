import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { User } from '../models/kullanici';
import { KullaniciService } from '../mainPage/services/kullanici.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateKullaniciComponent } from './update-kullanici/update-kullanici.component';
import { AddKullaniciComponent } from './add-kullanici/add-kullanici.component';
import * as XLSX from 'xlsx';
import { LogService } from '../mainPage/services/log.service';
import { Log } from '../models/log';
import * as sha256 from 'crypto-js/sha256';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-kullanici',
  templateUrl: './kullanici.component.html',
  styleUrls: ['./kullanici.component.css']
})
export class KullaniciComponent implements OnInit {
  kullanicilar: User[] = [];
  kullaniciForm: FormGroup;

  constructor(
    private kullaniciService: KullaniciService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private logService: LogService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getKullanicilar();
    this.kullaniciForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator]],
      phone: ['', Validators.required],
      adress: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[!@#\$%\^\&*\)\(+=._-]/.test(value);
    const validLength = value.length >= 8;

    const passwordValid = hasNumber && hasUpper && hasLower && hasSpecial && validLength;
    return !passwordValid ? { 'passwordInvalid': true } : null;
  }

  addKullanici() {
    if (this.kullaniciForm.valid) {
      const formValues = this.kullaniciForm.value;
      const hashedPassword = sha256(formValues.password).toString();
      const newUser = { ...formValues, password: hashedPassword };

      this.kullaniciService.add(newUser).subscribe(() => {
        this.toastr.success('Kullanıcı başarıyla eklendi.');
        this.kullaniciForm.reset();
        this.getKullanicilar();
      }, error => {
        this.toastr.error('Kullanıcı eklenirken bir hata oluştu.');
        console.error('Kullanıcı eklenirken bir hata oluştu', error);
        this.logError(`Kullanıcı eklenirken hata oluştu: ${error.message}`);
      });
    } else {
      this.toastr.warning('Lütfen tüm gerekli alanları doldurun.');
      this.logError('Gerekli alanlar doldurulmadı.');
    }
  }

  getKullanicilar(): void {
    this.kullaniciService.getAll().subscribe(data => {
      this.kullanicilar = data;
    });
  }

  deleteSelectedKullanicilar(): void {
    const selectedKullanici = this.kullanicilar.find(kullanici => kullanici.selected);
    if (selectedKullanici) {
      const confirmation = confirm('Silmek istediğinize emin misiniz?');
      if (confirmation) {
        this.kullaniciService.delete(selectedKullanici.id).subscribe(() => {
          this.kullanicilar = this.kullanicilar.filter(k => k.id !== selectedKullanici.id);
          this.toastr.success('Kullanıcı başarıyla silindi.');
        }, error => {
          this.toastr.error('Kullanıcı silinirken bir hata oluştu.');
          console.error('Kullanıcı silinirken bir hata oluştu', error);
          this.logError(`Kullanıcı silinirken hata oluştu: ${error.message}`);
        });
      }
    } else {
      this.toastr.warning('Lütfen silmek için bir kullanıcı seçin.');
      this.logError('Silme işlemi yapılırken hiçbir kullanıcı seçilmedi.');
    }
  }

  openUpdateModal(): void {
    const selectedKullanici = this.kullanicilar.find(kullanici => kullanici.selected);
    if (selectedKullanici) {
      const modalRef = this.modalService.open(UpdateKullaniciComponent);
      modalRef.componentInstance.kullanici = selectedKullanici;
      modalRef.result.then(() => {
        this.getKullanicilar();
        this.toastr.success('Kullanıcı başarıyla güncellendi.');
      }, (reason) => {
        if (reason !== 'save') {
          this.toastr.warning('Kullanıcı güncelleme işlemi iptal edildi.');
        }
      });
    } else {
      this.toastr.warning('Lütfen düzenlemek için bir kullanıcı seçin.');
      this.logError('Düzenleme işlemi yapılırken hiçbir kullanıcı seçilmedi.');
    }
  }

  openAddModal(): void {
    const modalRef = this.modalService.open(AddKullaniciComponent);
    modalRef.result.then(() => {
      this.getKullanicilar();
      this.toastr.success('Kullanıcı başarıyla eklendi.');
    }, (reason) => {
      if (reason !== 'save') {
        this.toastr.warning('Kullanıcı ekleme işlemi iptal edildi.');
      }
    });
  }

  selectRow(selectedKullanici: User): void {
    this.kullanicilar.forEach(kullanici => {
      if (kullanici !== selectedKullanici) {
        kullanici.selected = false;
      }
    });
  }

  exportSelectedToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.kullanicilar);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'users_list.xlsx');
  }

  logError(message: string) {
    const log: Log = {
      kullaniciId: this.getUserId(),
      durum: "Başarısız",
      islemTip: "Kullanıcı İşlemi",
      aciklama: message,
      tarihveSaat: new Date(),
      kullaniciTip: "User"
    };
    this.logService.add(log).subscribe(() => {
      console.log('Hata loglandı.');
    }, error => {
      console.error('Loglama sırasında hata oluştu:', error);
    });
  }

  getUserId(): number {
    // Kullanıcı ID'sini almak için gerekli işlemleri burada yapın
    return 1; // Örnek ID, gerçek uygulamada oturumdan alınmalı
  }
}