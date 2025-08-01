import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tr[app-employee-card]',
  imports: [CommonModule],
  templateUrl: './employee-card.component.html',
  styleUrl: './employee-card.component.css'
})
export class EmployeeCardComponent {
    @Input() employee!: Employee;
    @Output() edit = new EventEmitter<Employee>();
    @Output() delete = new EventEmitter<number>();

    onEdit(): void {
        this.edit.emit(this.employee);
    }

    onDelete(): void {
        this.delete.emit(this.employee.id);
    }
}
