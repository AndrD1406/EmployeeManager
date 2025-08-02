import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-employee-details',
  imports: [DatePipe, CommonModule],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent {
    @Input() employee!: Employee;
    @Output() close = new EventEmitter<void>();
}
