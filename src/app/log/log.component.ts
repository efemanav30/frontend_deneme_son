import { Component, OnInit } from '@angular/core';
import { LogService } from '../mainPage/services/log.service';
import { Log } from '../models/log';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  logs: Log[] = [];

  constructor(private logService: LogService, private router: Router) { }

  ngOnInit(): void {
    this.getLogs();
  }

  getLogs(): void {
    this.logService.getAll().subscribe(
      logs => {
        this.logs = logs;
        console.log('Logs:', this.logs);
      },
      error => console.error('Error fetching logs:', error)
    );
  }
  
  selectAll(event): void {
    this.logs.forEach(log => log.selected = event.target.checked);
  }

  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.logs);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'logs.xlsx');
  }

  viewLogDetails(): void {
    this.router.navigate(['/log-details']);
  }
}
