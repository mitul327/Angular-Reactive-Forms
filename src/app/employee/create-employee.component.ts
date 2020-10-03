import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css'],
})
export class CreateEmployeeComponent implements OnInit {
  public employeeForm: FormGroup;
  constructor() {}

  public ngOnInit(): void {
    this.employeeForm = new FormGroup({
      fullName: new FormControl(),
      email: new FormControl(),
      skills: new FormGroup({
        skillName: new FormControl(),
        experienceInYears: new FormControl(),
        proficiency: new FormControl(),
      }),
    });
  }

  public onSubmit(): void {
    console.log(this.employeeForm);
  }

  public onLoadDataClick(): void {
      this.employeeForm.patchValue({
        fullName: 'Mitul Panchal',
        email: 'mitul327@rediffmail.com',
      /*   skills: {
          skillName: 'Angular',
          experienceInYears: 8,
          proficiency: 'intermediate',
        }, */
      });
  }
}
