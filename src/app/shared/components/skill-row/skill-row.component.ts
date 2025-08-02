import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Skill } from '../../models/skill.model';

@Component({
  selector: 'app-skill-row',
  imports: [],
  templateUrl: './skill-row.component.html',
  styleUrl: './skill-row.component.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SkillRowComponent),
    multi: true
  }]
})
export class SkillRowComponent {
    skill = '';
    yearExperience = 0;
    disabled = false;

    private onChange = (_: Skill) => {}
    private onTouched = () => {}

    writeValue(obj: Skill | null): void{
        if (obj) {
            this.skill = obj.skill;
            this.yearExperience = obj.yearExperience;
        } else {
            this.skill = '';
            this.yearExperience = 0;
        }
    }

    registerOnChange(fn: (_: Skill) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    propagateChange() {
        this.onChange({
        skill: this.skill,
        yearExperience: this.yearExperience
        });
    }

    propagateTouched() {
        this.onTouched();
    }

    onSkillInput(value: string) {
        this.skill = value;
        this.propagateChange();
    }

    onYearsInput(value: string) {
        this.yearExperience = Number(value);
        this.propagateChange();
    }
}
