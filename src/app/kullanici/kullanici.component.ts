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
  filteredKullanicilar: User[] = [];
  kullaniciForm: FormGroup;
  searchKeyword: string = '';
  selectedItems: User[] = [];
  page: number = 1;

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
      if (confirm('Bu kullanıcıyı eklemek istediğinize emin misiniz?')) {
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
      }
    } else {
      this.toastr.warning('Lütfen tüm gerekli alanları doldurun.');
      this.logError('Gerekli alanlar doldurulmadı.');
    }
  }

  getKullanicilar(): void {
    this.kullaniciService.getAll().subscribe(data => {
      this.kullanicilar = data;
      this.filteredKullanicilar = this.kullanicilar;
    });
  }

  searchKullanicilar() {
    if (this.searchKeyword.trim() === '') {
      this.filteredKullanicilar = this.kullanicilar;
    } else {
      this.filteredKullanicilar = this.kullanicilar.filter(kullanici =>
        kullanici.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        kullanici.surname.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        kullanici.email.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        kullanici.phone.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        kullanici.adress.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        kullanici.role.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    }
  }

  selectAll(event: any) {
    this.filteredKullanicilar.forEach(kullanici => kullanici.selected = event.target.checked);
    this.updateSelectedItems();
  }

  updateSelectedItems() {
    this.selectedItems = this.filteredKullanicilar.filter(kullanici => kullanici.selected);
  }

  deleteSelectedKullanicilar(): void {
    if (this.selectedItems.length > 0) {
      const confirmation = confirm('Seçilen kullanıcıları silmek istediğinize emin misiniz?');
      if (confirmation) {
        this.selectedItems.forEach(selectedKullanici => {
          this.kullaniciService.delete(selectedKullanici.id).subscribe(() => {
            this.kullanicilar = this.kullanicilar.filter(k => k.id !== selectedKullanici.id);
            this.filteredKullanicilar = this.filteredKullanicilar.filter(k => k.id !== selectedKullanici.id);
            this.toastr.success('Kullanıcı başarıyla silindi.');
          }, error => {
            this.toastr.error('Kullanıcı silinirken bir hata oluştu.');
            console.error('Kullanıcı silinirken bir hata oluştu', error);
            this.logError(`Kullanıcı silinirken hata oluştu: ${error.message}`);
          });
        });
      }
    } else {
      this.toastr.error('Silmek için hiçbir kullanıcı seçilmedi.', 'Hata', { timeOut: 3000, closeButton: true, progressBar: true });
      this.logError('Silme işlemi yapılırken hiçbir kullanıcı seçilmedi.');
    }
  }

  openUpdateModal(): void {
    if (this.selectedItems.length === 1) {
      const selectedKullanici = this.selectedItems[0];
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
    } else if (this.selectedItems.length > 1) {
      this.toastr.warning('Birden fazla kullanıcı seçildi. Lütfen yalnızca bir kullanıcı seçin.');
      this.logError('Düzenleme işlemi yapılırken birden fazla kullanıcı seçildi.');
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
    this.updateSelectedItems();
  }

  exportSelectedToExcel(): void {
    const selectedUsers = this.selectedItems.map(user => ({
      Ad: user.name,
      Soyad: user.surname,
      Email: user.email,
      Telefon: user.phone,
      Adres: user.adress,
      Rol: user.role
    }));

    if (selectedUsers.length === 0) {
      this.toastr.error('Excel\'e aktarmak için en az bir kullanıcı seçin.', 'Hata', { timeOut: 3000, closeButton: true, progressBar: true });
      return;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedUsers);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'selected_users.xlsx');
  }

  logError(message: string) {
    const log: Log = {
      kullaniciId: this.getUserId(),
      durum: 'Başarısız',
      islemTip: 'Kullanıcı İşlemi',
      aciklama: message,
      tarihveSaat: new Date(),
      kullaniciTip: 'User'
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
