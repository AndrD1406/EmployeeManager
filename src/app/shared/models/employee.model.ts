import { Skill } from "./skill.model";

export interface Employee{
    id: number;
    fullName: string;
    email: string;
    position: string;
    skills: Skill[];
    startDate: Date;
}