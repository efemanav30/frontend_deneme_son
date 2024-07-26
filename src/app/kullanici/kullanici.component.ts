import { Component, OnInit } from '@angular/core';
import { User } from '../models/kullanici';
import { KullaniciService } from '../mainPage/services/kullanici.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateKullaniciComponent } from './update-kullanici/update-kullanici.component';
import { AddKullaniciComponent } from './add-kullanici/add-kullanici.component';
import * as XLSX from 'xlsx';
import { LogService } from '../mainPage/services/log.service';
import { Log } from '../models/log';

@Component({
  selector: 'app-kullanici',
  templateUrl: './kullanici.component.html',
  styleUrls: ['./kullanici.component.css']
})
export class KullaniciComponent implements OnInit {
  kullanicilar: User[] = [];

  constructor(private kullaniciService: KullaniciService, private modalService: NgbModal, private logService: LogService) { }

  ngOnInit(): void {
    this.getKullanicilar();
  }

  getKullanicilar(): void {
    this.kullaniciService.getAll().subscribe(data => {
      this.kullanicilar = data;
    });
  }

  deleteSelectedKullanicilar(): void {
    if (confirm('Silmek istediğinize emin misiniz?')) {
      const selectedKullanici = this.kullanicilar.find(kullanici => kullanici.selected);
      if (selectedKullanici) {
        this.kullaniciService.delete(selectedKullanici.id).subscribe(() => {
          this.kullanicilar = this.kullanicilar.filter(k => k.id !== selectedKullanici.id);
          alert('Kullanıcı başarıyla silindi.');
        });
      } else {
        alert('Lütfen silmek için bir kullanıcı seçin.');
        const log: Log = {
          kullaniciId: this.getUserId(),
          durum: "Başarısız",
          islemTip: "Kullanıcı Silme",
          aciklama: "Silme işlemi yapılırken hiçbir kullanıcı seçilmedi.",
          tarihveSaat: new Date(),
          kullaniciTip: "User"
        };
        this.logService.add(log).subscribe(() => {
          console.log('Silme işlemi loglandı.');
        }, error => {
          console.error('Loglama sırasında hata oluştu:', error);
        });
      }
    }
  }

  openUpdateModal(): void {
    const selectedKullanici = this.kullanicilar.find(kullanici => kullanici.selected);
    if (selectedKullanici) {
      const modalRef = this.modalService.open(UpdateKullaniciComponent);
      modalRef.componentInstance.kullanici = selectedKullanici;
      modalRef.result.then(() => this.getKullanicilar(), () => {});
    } else {
      alert('Lütfen düzenlemek için bir kullanıcı seçin.');
      const log: Log = {
        kullaniciId: this.getUserId(),
        durum: "Başarısız",
        islemTip: "Kullanıcı Düzenleme",
        aciklama: "Düzenleme işlemi yapılırken hiçbir kullanıcı seçilmedi.",
        tarihveSaat: new Date(),
        kullaniciTip: "User"
      };
      this.logService.add(log).subscribe(() => {
        console.log('Düzenleme işlemi loglandı.');
      }, error => {
        console.error('Loglama sırasında hata oluştu:', error);
      });
    }
  }

  openAddModal(): void {
    const modalRef = this.modalService.open(AddKullaniciComponent);
    modalRef.result.then(() => this.getKullanicilar(), () => {});
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

  getUserId(): number {
    // Kullanıcı ID'sini almak için gerekli işlemleri burada yapın
    return 1; // Örnek ID, gerçek uygulamada oturumdan alınmalı
  }
}
