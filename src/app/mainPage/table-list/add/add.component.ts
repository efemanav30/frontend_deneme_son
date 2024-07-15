import { Component } from '@angular/core';
import { IlService } from '../../services/il.service';
import { IlceService } from '../../services/ilce.service';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {

  iller: any[] = [];
  ilceler: any[] = [];
  selectedIl: number;

  constructor( private ilService: IlService, private ilceService: IlceService) { }

  ngOnInit() {
    this.loadIller();
  }

  loadIller(){
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
}