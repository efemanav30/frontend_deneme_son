import { Component, OnInit } from '@angular/core';
import { Tasinmaz } from 'src/app/models/tasinmaz';
import { TasinmazService } from 'src/app/tasinmaz.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  tasinmazlar: Tasinmaz[] = [];
  constructor(private tasinmazService: TasinmazService) { }


  ngOnInit() {
    this.tasinmazService.getTasinmazlar().subscribe(data=>{
      console.log('API Response:', data); // Gelen veriyi kontrol edin
      this.tasinmazlar=data;
      
    });
    
  }

  
  
}
//BURADA OYNAMA YAPILINCA TÜM EKRAN BEYAZ OLUYOR