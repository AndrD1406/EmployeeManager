import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Employee } from "../models/employee.model";

@Injectable({ providedIn: 'root' })
export class EmployeeService{
    private readonly storageKey = 'employees'
    private emps$ = new BehaviorSubject<Employee[]>([]);
    readonly employees$ = this.emps$.asObservable();
    private nextId: number;

    constructor(){
        const data = localStorage.getItem(this.storageKey);
        let emps: Employee[];
        if (data){
            emps = JSON.parse(data).map((e: any) => ({
                ...e,
                startDate: new Date(e.startDate)
            }));
        } else {
            emps = [
                {
                id: 1,
                fullName: 'John Doe',
                email: 'john.doe@example.com',
                position: 'Developer',
                startDate: new Date('2023-01-15'),
                skills: [
                    { skill: 'Angular', yearExperience: 2 },
                    { skill: 'TypeScript', yearExperience: 3 }
                ]
                },
                {
                id: 2,
                fullName: 'Jane Smith',
                email: 'jane.smith@example.com',
                position: 'Designer',
                startDate: new Date('2022-06-20'),
                skills: [
                    { skill: 'CSS', yearExperience: 4 },
                    { skill: 'HTML', yearExperience: 5 }
                ]
                }
            ];
            localStorage.setItem(this.storageKey, JSON.stringify(emps));
            }
        this.emps$.next(emps);
        this.nextId = emps.length > 0 ? Math.max(...emps.map(e => e.id)) + 1 : 1;
    }

    getAll(): Observable<Employee[]> {
        return this.employees$;
    }

    getById(id: number): Employee | undefined {
        return this.emps$.value.find(e => e.id === id);
    }

    add(emp: Omit<Employee, 'id'>): void {
        const newEmp: Employee = { id: this.nextId++, ...emp };
        const list = [...this.emps$.value, newEmp];
        this.emps$.next(list);
        this.persist(list);
    }

    update(emp: Employee): void {
        const list = this.emps$.value.map(e => e.id === emp.id ? emp : e);
        this.emps$.next(list);
        this.persist(list);
    }

    delete(id: number): void {
        const list = this.emps$.value.filter(e => e.id !== id);
        this.emps$.next(list);
        this.persist(list);
    }

    private persist(list: Employee[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(list));
    }
}