import { Component, OnInit } from '@angular/core';
import { LogService } from 'src/app/mainPage/services/log.service';
import { KullaniciService } from 'src/app/mainPage/services/kullanici.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-log-details',
  templateUrl: './log-details.component.html',
  styleUrls: ['./log-details.component.css']
})
export class LogDetailsComponent implements OnInit {
  logs: any[] = [];
  searchTerm: string = '';
  page: number = 1;

  constructor(private logService: LogService, private kullaniciService: KullaniciService) { }

  ngOnInit(): void {
    this.getLogs();
  }

  getLogs(): void {
    this.logService.getLogs().subscribe(
      (data) => {
        this.logs = data;
      },
      (error) => {
        console.error('Hata:', error);
      }
    );
  }

  searchLogs(): void {
    this.logService.searchLogs(this.searchTerm).subscribe(
      (data) => {
        this.logs = data;
      },
      (error) => {
        console.error('Hata:', error);
      }
    );
  }

  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.logs);
    const workbook: XLSX.WorkBook = { Sheets: { 'logs': worksheet }, SheetNames: ['logs'] };
    XLSX.writeFile(workbook, 'log_details.xlsx');
  }
}
