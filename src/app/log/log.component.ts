import { Component, OnInit } from '@angular/core';
import { LogService } from '../mainPage/services/log.service';
import { Log } from '../models/log';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  logs: Log[] = [];

  constructor(private logService: LogService) { }

  ngOnInit(): void {
    this.getLogs();
  }

  getLogs(): void {
    this.logService.getAll().subscribe(logs => {
      this.logs = logs;
    });
  }

  selectAll(event): void {
    this.logs.forEach(log => log.selected = event.target.checked);
  }

 
  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.logs);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'logs.xlsx');
  }
}
