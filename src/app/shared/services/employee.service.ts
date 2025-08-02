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
            },
            {
                id: 3,
                fullName: 'George Washington',
                email: 'george.washington@example.com',
                position: 'President',
                startDate: new Date('1789-04-30'),
                skills: [
                { skill: 'Leadership', yearExperience: 8 },
                { skill: 'Military Strategy', yearExperience: 8 }
                ]
            },
            {
                id: 4,
                fullName: 'Abraham Lincoln',
                email: 'abraham.lincoln@example.com',
                position: 'President',
                startDate: new Date('1861-03-04'),
                skills: [
                { skill: 'Emancipation', yearExperience: 4 },
                { skill: 'Oratory', yearExperience: 4 }
                ]
            },
            {
                id: 5,
                fullName: 'Theodore Roosevelt',
                email: 'theodore.roosevelt@example.com',
                position: 'President',
                startDate: new Date('1901-09-14'),
                skills: [
                { skill: 'Conservation', yearExperience: 7 },
                { skill: 'Progressivism', yearExperience: 7 }
                ]
            },
            {
                id: 6,
                fullName: 'Franklin D. Roosevelt',
                email: 'franklin.roosevelt@example.com',
                position: 'President',
                startDate: new Date('1933-03-04'),
                skills: [
                { skill: 'Economic Recovery', yearExperience: 12 },
                { skill: 'Public Speaking', yearExperience: 12 }
                ]
            },
            {
                id: 7,
                fullName: 'John F. Kennedy',
                email: 'john.kennedy@example.com',
                position: 'President',
                startDate: new Date('1961-01-20'),
                skills: [
                { skill: 'Diplomacy', yearExperience: 3 },
                { skill: 'Inspiration', yearExperience: 3 }
                ]
            },
            {
                id: 8,
                fullName: 'Barack Obama',
                email: 'barack.obama@example.com',
                position: 'President',
                startDate: new Date('2009-01-20'),
                skills: [
                { skill: 'Healthcare Reform', yearExperience: 8 },
                { skill: 'Community Organizing', yearExperience: 8 }
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