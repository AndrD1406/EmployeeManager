import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { EmployeeCardComponent } from '../employee-card/employee-card.component';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

type SortField = 'fullName'|'startDate'|'skillCount';
type SortDir   = 'asc'|'desc';

@Component({
    selector: 'app-employee-list',
    imports: [CommonModule, ReactiveFormsModule, EmployeeCardComponent],
    templateUrl: './employee-list.component.html',
    styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
    searchControl = new FormControl('');
    
    private sortField$     = new BehaviorSubject<SortField>('fullName');
    private sortDirection$ = new BehaviorSubject<SortDir>('asc');

    get sortField(): SortField {
        return this.sortField$.value;
    }

    get sortDirection(): SortDir {
        return this.sortDirection$.value;
    }


    filteredAndSorted$ :any;

    constructor(private employeeService: EmployeeService) {}

    ngOnInit() {
        this.filteredAndSorted$ = combineLatest([
            this.searchControl.valueChanges.pipe(
            startWith(''),
            debounceTime(300),
            distinctUntilChanged(),
            map(term => (term||'').toLowerCase())
            ),
            this.employeeService.employees$,
            this.sortField$,
            this.sortDirection$
        ]).pipe(
            map(([term, emps, field, dir]) =>
            emps
                .filter(e =>
                e.fullName.toLowerCase().includes(term) ||
                e.email.toLowerCase().includes(term)
                )
                .sort((a, b) => this.compare(a, b, field, dir))
            )
        );
    }

    onSort(field: SortField) {
        if (this.sortField$.value === field) {
        this.sortDirection$.next(
            this.sortDirection$.value === 'asc' ? 'desc' : 'asc'
        );
        } else {
        this.sortField$.next(field);
        this.sortDirection$.next('asc');
        }
    }

    onEdit(employee: Employee) {
        //
    }

    onDelete(id: number) {
        this.employeeService.delete(id);
    }

    private compare( a: Employee, b: Employee, field: SortField, dir: SortDir): number {
        let aVal: any, bVal: any;
        switch (field) {
        case 'fullName':
            aVal = a.fullName.toLowerCase();
            bVal = b.fullName.toLowerCase();
            return dir === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);

        case 'startDate':
            aVal = a.startDate.getTime();
            bVal = b.startDate.getTime();
            return dir === 'asc'
            ? aVal - bVal
            : bVal - aVal;

        case 'skillCount':
            aVal = a.skills.length;
            bVal = b.skills.length;
            return dir === 'asc'
            ? aVal - bVal
            : bVal - aVal;
        }
    }
}
