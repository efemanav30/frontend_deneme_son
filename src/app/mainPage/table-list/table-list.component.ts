import { Component, OnInit } from '@angular/core';
import { Tasinmaz } from 'src/app/models/tasinmaz';
import { TasinmazService } from 'src/app/tasinmaz.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateComponent } from './update/update.component';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  tasinmazlar: Tasinmaz[] = [];
  coordinates: { lon: number; lat: number; }[];

  constructor(private tasinmazService: TasinmazService,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.loadTasinmazlar();
  }

  loadTasinmazlar() {
    this.tasinmazService.getTasinmazlar().subscribe(data => {
      this.tasinmazlar = data;
      this.extractCoordinates();

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
      const confirmation = confirm('Silmek istediğinize emin misiniz?');
      if (confirmation) {
        this.tasinmazService.deleteTasinmaz(selectedTasinmaz.id).subscribe(() => {
          console.log('Taşınmaz başarıyla silindi:', selectedTasinmaz);
          alert('Taşınmaz başarıyla silindi.');
          this.loadTasinmazlar();
        }, error => {
          console.error('Taşınmaz silinirken bir hata oluştu:', error);
        });
      }
    } else {
      alert('Silmek için hiçbir taşınmaz seçilmedi.');

      console.log('Silmek için hiçbir taşınmaz seçilmedi');
    }
  }

  openUpdateModal() {
    const selectedTasinmaz = this.tasinmazlar.find(tasinmaz => tasinmaz.selected);
    console.log(selectedTasinmaz);
   // console.log('seçilen taşınmaz id: ', selectedTasinmaz.id);

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
      alert('Düzenlemek için hiçbir taşınmaz seçilmedi.');
      console.log('Düzenlemek için hiçbir taşınmaz seçilmedi');
    }
  }
  extractCoordinates(): void {
    this.coordinates = this.tasinmazlar.map(tasinmaz => {
      const coords = tasinmaz.koordinatBilgileri.split(',').map(coord => parseFloat(coord.trim()));
      console.log("Extracted coordinates:", coords);
      return { lon: coords[1], lat: coords[0] }; // Koordinatları doğru sırayla ayırıyoruz
    });
    console.log("Coordinates to be sent to the map:", this.coordinates);
  }
  
}
