import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-grid-employee-card',
  imports: [DatePipe],
  templateUrl: './grid-employee-card-component.html',
  styleUrl: './grid-employee-card-component.css'
})
export class GridEmployeeCardComponentComponent {
    @Input() employee!: Employee;
    @Output() edit = new EventEmitter<Employee>();
    @Output() delete = new EventEmitter<number>();
    @Output() details = new EventEmitter<Employee>();

    onEdit(): void {
        this.edit.emit(this.employee);
    }

    onDelete(): void {
        this.delete.emit(this.employee.id);
    }

    onDetails(): void {
        this.details.emit(this.employee);
    }
}
