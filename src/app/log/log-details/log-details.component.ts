import { Component, OnInit } from '@angular/core';
import { LogService } from 'src/app/mainPage/services/log.service';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-log-details',
  templateUrl: './log-details.component.html',
  styleUrls: ['./log-details.component.css']
})
export class LogDetailsComponent implements OnInit {
  logs: any[] = [];
  searchTerm: string = '';
  page: number = 1;

  constructor(private logService: LogService, private toastr:ToastrService) { }

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

  selectAll(event: any): void {
    this.logs.forEach(log => log.selected = event.target.checked);
  }

  exportToExcel(): void {
    const selectedLogs = this.logs.filter(log => log.selected);
    if (selectedLogs.length === 0) {
      this.toastr.error('Lütfen Excel\'e aktarmak için en az bir log seçin.');
      return;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedLogs);
    const workbook: XLSX.WorkBook = { Sheets: { 'logs': worksheet }, SheetNames: ['logs'] };
    XLSX.writeFile(workbook, 'selected_log_details.xlsx');
  }
}
