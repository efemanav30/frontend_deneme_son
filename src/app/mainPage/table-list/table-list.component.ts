import { Component, OnInit } from '@angular/core';
import { Tasinmaz } from 'src/app/models/tasinmaz';
import { TasinmazService } from 'src/app/tasinmaz.service';
import { UpdateComponent } from './update/update.component';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  tasinmazlar: Tasinmaz[] = [];
  modalService: any;
  constructor(private tasinmazService: TasinmazService,
    //private ngbModal: NgbModal // NgbModal inject edin
    ) { }


  ngOnInit() {
    this.tasinmazService.getTasinmazlar().subscribe(data=>{
      console.log('API Response:', data); // Gelen veriyi kontrol edin
      this.tasinmazlar=data;
      
    });
    
  }

  loadTasinmazlar() {
    this.tasinmazService.getTasinmazlar().subscribe(data => {
      this.tasinmazlar = data;
    });
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
      this.tasinmazService.deleteTasinmaz(selectedTasinmaz.id).subscribe(() => {
        console.log('Taşınmaz başarıyla silindi:', selectedTasinmaz);
        this.loadTasinmazlar(); // Taşınmazları yeniden yükleyerek tabloyu güncelle
      }, error => {
        console.error('Taşınmaz silinirken bir hata oluştu:', error);
      });
    } else {
      console.log('Silmek için hiçbir taşınmaz seçilmedi');
    }
  }

  openEditModal() {
    const selectedTasinmaz = this.tasinmazlar.find(tasinmaz => tasinmaz.selected);
    console.log(selectedTasinmaz);

    if (selectedTasinmaz) {
      const modalRef = this.modalService.open(UpdateComponent);
      modalRef.componentInstance.tasinmazId = selectedTasinmaz.id;

      modalRef.result.then((result) => {
        if (result === 'save') {
          this.loadTasinmazlar(); // Düzenleme sonrası taşınmazları yeniden yükleyin
        }
      }, (reason) => {
        console.log('Modal dismissed: ', reason);
      });
    } else {
      console.log('Düzenlemek için hiçbir taşınmaz seçilmedi');
    }
  }
}
//BURADA OYNAMA YAPILINCA TÜM EKRAN BEYAZ OLUYOR