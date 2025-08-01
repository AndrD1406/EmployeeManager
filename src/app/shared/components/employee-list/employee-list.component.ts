import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { EmployeeCardComponent } from '../employee-card/employee-card.component';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
    selector: 'app-employee-list',
    imports: [CommonModule, ReactiveFormsModule, EmployeeCardComponent],
    templateUrl: './employee-list.component.html',
    styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
    searchControl = new FormControl('');
    sortField: 'fullName' | 'startDate' | 'skillCount' = 'fullName';
    sortDirection: 'asc' | 'desc' = 'asc';

    filteredAndSorted$ :any;

    constructor(private employeeService: EmployeeService) {}

    ngOnInit() {
        this.filteredAndSorted$ = combineLatest([
        this.searchControl.valueChanges.pipe(
            startWith(''),
            debounceTime(300),
            distinctUntilChanged(),
            map(term => term?.toLowerCase() ?? '')
        ),
        this.employeeService.employees$
        ]).pipe(
        map(([term, emps]) =>
            emps
            .filter(e =>
                e.fullName.toLowerCase().includes(term) ||
                e.email.toLowerCase().includes(term)
            )
            .sort((a, b) => this.compare(a, b))
        )
        );
    }

    onSort(field: 'fullName' | 'startDate' | 'skillCount') {
        if (this.sortField = field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDirection = 'asc';
        }
    }

    onEdit(employee: Employee) {
        //
    }

    onDelete(id: number) {
        this.employeeService.delete(id);
    }

    private compare(a: Employee, b: Employee): number {
        let aVal: any, bVal: any;
        switch(this.sortField){
            case 'fullName':
                aVal = a.fullName.toLowerCase();
                bVal = b.fullName.toLowerCase();
                return this.sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            case 'startDate':
                aVal = a.startDate.getTime();
                bVal = b.startDate.getTime();
                return this.sortDirection === 'asc' ? aVal - bVal: bVal - aVal;
            case 'skillCount':
                aVal = a.skills.length;
                bVal = b.skills.length;
                return this.sortDirection === 'asc' ? aVal - bVal: bVal - aVal;
        }
    }
}
