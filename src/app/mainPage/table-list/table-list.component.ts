import { Component, OnInit } from '@angular/core';
import { Tasinmaz } from 'src/app/models/tasinmaz';
import { TasinmazService } from 'src/app/tasinmaz.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateComponent } from './update/update.component';
import * as XLSX from 'xlsx';
import { LogService } from '../services/log.service';
import { Log } from 'src/app/models/log';
import { ToastrService } from 'ngx-toastr';
import { AddComponent } from './add/add.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  tasinmazlar: Tasinmaz[] = [];
  coordinates: { lon: number; lat: number; }[];
  searchKeyword: string = '';

  constructor(private tasinmazService: TasinmazService,
              private modalService: NgbModal,
              private logService: LogService,
              public activeModal: NgbActiveModal, // Modal kontrolü için ekledik

              private toastr: ToastrService) { }

  ngOnInit() {
    this.loadTasinmazlar();
  }

  openAddModal() {
    const modalRef = this.modalService.open(AddComponent);
    modalRef.result.then((result) => {
      if (result === 'save') {
        this.loadTasinmazlar();
        this.activeModal.close('save');//EKLEDİKTEN SONRA MODAL KAPANIYOR
      }
    }, (reason) => {
      console.log('Modal dismissed:', reason);
    });
  }
  

  loadTasinmazlar() {
    this.tasinmazService.getTasinmazlar().subscribe(
      data => {
        this.tasinmazlar = data;
        console.log('Loaded Tasinmazlar:', this.tasinmazlar);
        if (this.tasinmazlar) {
          this.extractCoordinates();
        }
      },
      error => {
        console.error('Error loading Tasinmazlar:', error);
      }
    );
  }

  selectRow(selectedTasinmaz: Tasinmaz) {
    this.tasinmazlar.forEach(tasinmaz => {
      if (tasinmaz !== selectedTasinmaz) {
        tasinmaz.selected = false;
      }
    });
  }

  deleteSelectedTasinmaz() {
    const selectedTasinmaz = this.tasinmazlar.find(tasinmaz => tasinmaz.selected);
    if (selectedTasinmaz) {
      const confirmation = confirm('Silmek istediğinize emin misiniz?');
      if (confirmation) {
        this.tasinmazService.deleteTasinmaz(selectedTasinmaz.id).subscribe(() => {
          console.log('Taşınmaz başarıyla silindi:', selectedTasinmaz);
          this.toastr.success('Taşınmaz başarıyla silindi.');
          this.loadTasinmazlar();
        }, error => {
          console.error('Taşınmaz silinirken bir hata oluştu:', error);
          this.toastr.error('Taşınmaz silinirken bir hata oluştu.');
        });
      }
    } else {
      this.toastr.error('Silmek için hiçbir taşınmaz seçilmedi.');
      console.log('Silmek için hiçbir taşınmaz seçilmedi');
      const log: Log = {
        kullaniciId: this.getUserId(), // Kullanıcı ID'yi alın
        durum: "Başarısız",
        islemTip: "Taşınmaz Silme",
        aciklama: "Silme işlemi yapılırken hiçbir taşınmaz seçilmedi.",
        tarihveSaat: new Date(),
        kullaniciTip: "User" // Giriş yapan kullanıcının tipini alın
      };
      this.logService.add(log).subscribe(() => {
        console.log('Silme işlemi loglandı.');
      }, error => {
        console.error('Loglama sırasında hata oluştu:', error);
      });
    }
  }

  openUpdateModal() {
    const selectedTasinmaz = this.tasinmazlar.find(tasinmaz => tasinmaz.selected);
    if (selectedTasinmaz) {
      const modalRef = this.modalService.open(UpdateComponent);
      modalRef.componentInstance.tasinmazId = selectedTasinmaz.id;
  
      modalRef.result.then((result) => {
        if (result === 'save') {
          this.loadTasinmazlar(); // Düzenleme sonrası taşınmazları yeniden yükleyin
          this.toastr.success('Taşınmaz başarıyla güncellendi.');
        }
      }, (reason) => {
        console.log('Modal dismissed: ', reason);
      });
    } else {
      this.toastr.warning('Düzenlemek için hiçbir taşınmaz seçilmedi.');
      console.log('Düzenlemek için hiçbir taşınmaz seçilmedi');
      const log: Log = {
        kullaniciId: this.getUserId(), // Kullanıcı ID'yi alın
        durum: "Başarısız",
        islemTip: "Taşınmaz Düzenleme",
        aciklama: "Düzenleme işlemi yapılırken hiçbir taşınmaz seçilmedi.",
        tarihveSaat: new Date(),
        kullaniciTip: "User" // Giriş yapan kullanıcının tipini alın
      };
      this.logService.add(log).subscribe(() => {
        console.log('Düzenleme işlemi loglandı.');
      }, error => {
        console.error('Loglama sırasında hata oluştu:', error);
      });
    }
  }
  

  extractCoordinates(): void {
    if (!this.tasinmazlar || this.tasinmazlar.length === 0) {
      return;
    }
    this.coordinates = this.tasinmazlar.map(tasinmaz => {
      const coords = tasinmaz.koordinatBilgileri.split(',').map(coord => parseFloat(coord.trim()));
      console.log("Extracted coordinates:", coords);
      return { lon: coords[1], lat: coords[0] }; // Koordinatları doğru sırayla ayırıyoruz
    });
    console.log("Coordinates to be sent to the map:", this.coordinates);
  }

  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tasinmazlar);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'tasinmazlar.xlsx');
  }

  searchTasinmaz() {
    if (this.searchKeyword.trim() === '') {
      this.loadTasinmazlar();
    } else {
      this.tasinmazService.searchTasinmazlar(this.searchKeyword).subscribe(
        (data: Tasinmaz[]) => {
          this.tasinmazlar = data;
        },
        error => {
          console.error('Taşınmazlar aranırken bir hata oluştu:', error);
        }
      );
    }
  }

  getUserId(): number {
    // Kullanıcı ID'sini almak için gerekli işlemleri burada yapın
    return 1; // Örnek ID, gerçek uygulamada oturumdan alınmalı
  }
}
