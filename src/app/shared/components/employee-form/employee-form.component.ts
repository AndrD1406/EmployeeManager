import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Employee } from '../../models/employee.model';
import { Skill } from '../../models/skill.model';
import { CommonModule } from '@angular/common';
import { SkillRowComponent } from '../skill-row/skill-row.component';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SkillRowComponent],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent {
    @Input()
    set employee(emp: Employee | undefined) {
        this._employee = emp;
        this.resetForm();
        this.buildForm();
    }
    private _employee?: Employee;

    @Output() saved  = new EventEmitter<Omit<Employee,'id'>>();
    @Output() cancel = new EventEmitter<void>();

    form!: FormGroup;

    constructor(private fb: FormBuilder) {}

    private skillNameValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const name = control.value.skill?.trim() ?? '';
            if (!name) {
                return { skillNameRequired: true };
            }
            if (name.length < 3) {
                return { skillNameTooShort: { requiredLength: 3, actualLength: name.length } };
            }
            return null;
        };
    }

    private buildForm() {
        this.form = this.fb.group({
            fullName:  [ this._employee?.fullName  ?? '', [Validators.required, Validators.minLength(3)]],
            email:     [ this._employee?.email     ?? '', [Validators.required, Validators.email] ],
            position:  [ this._employee?.position  ?? '', Validators.required ],
            startDate: [ this._employee
                            ? this._employee.startDate.toISOString().slice(0,10)
                            : '', Validators.required ],
            skills: this.fb.array<FormControl<Skill>>(
                (this._employee?.skills ?? [{ skill: '', yearExperience: 0 }])
                    .map(s =>
                        this.fb.control<Skill>(
                            s,
                            {
                                validators: [
                                    Validators.required,
                                    this.skillNameValidator()
                                ],
                                nonNullable: true
                            }
                        )
                    ),
                {
                    validators: [Validators.maxLength(10)]
                }
            )
        });
    }

    private resetForm() {
        this.form = this.fb.group({});
    }

    get fullName(): FormControl {
        return this.form.get('fullName') as FormControl;
    }

    get email(): FormControl {
        return this.form.get('email') as FormControl;
    }

    get position(): FormControl {
        return this.form.get('position') as FormControl;
    }

    get startDate(): FormControl {
        return this.form.get('startDate') as FormControl;
    }

    get skills(): FormArray {
        return this.form.get('skills') as FormArray;
    }

    get skillControls(): FormControl<Skill>[] {
        return (this.form.get('skills') as FormArray)
        .controls as FormControl<Skill>[];
    }

    addSkill() {
        this.skills.push(
        this.fb.control<Skill>(
            { skill:'', yearExperience:0 },
            { validators: Validators.required, nonNullable: true }
        )
        );
    }

    removeSkill(i: number) {
        this.skills.removeAt(i);
    }

    submit() {
        if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
        }
        const payload = this.form.getRawValue() as Omit<Employee,'id'>;
        this.saved.emit(payload);
    }

    onCancel() {
        this.cancel.emit();
    }
}
