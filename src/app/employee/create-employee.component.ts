import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from './employee.service';
import { IEmployee } from './IEmployee';
import { ISkill } from './ISkill';
import { Validators } from '@angular/forms';

import { CustomValidators } from '../shared/custom.validators';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css'],
})
export class CreateEmployeeComponent implements OnInit {
  public employeeForm: FormGroup;
  public employee: IEmployee;
  public pageTitle: string;
  validationMessages = {
    fullName: {
      required: 'Full Name is required.',
      minlength: 'Full Name must be greater than 2 characters',
      maxlength: 'Full Name must be less than 10 characters.',
    },
    email: {
      required: 'Email is required.',
      emailDomain: 'Email domian should be dell.com',
    },
    confirmEmail: {
      required: 'Confirm Email is required.',
    },
    emailGroup: {
      emailMismatch: 'Email and Confirm Email do not match.',
    },
    phone: {
      required: 'Phone is required.',
    },
  };

  formErrors = {
    fullName: '',
    email: '',
    confirmEmail: '',
    emailGroup: '',
    phone: '',
    skillName: '',
    experienceInYears: '',
    proficiency: '',
  };
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.employeeForm = this.fb.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(10),
        ],
      ],
      contactPreference: ['email'],
      emailGroup: this.fb.group(
        {
          email: [
            '',
            [Validators.required, CustomValidators.emailDomain('dell.com')],
          ],
          confirmEmail: ['', [Validators.required]],
        },
        { validator: this.matchEmails }
      ),
      phone: [''],
      skills: this.fb.array([this.addSkillFormGroup()]),
    });

    this.employeeForm
      .get('contactPreference')
      .valueChanges.subscribe((data: string) => {
        this.onContactPreferenceChange(data);
      });

    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });

    this.route.paramMap.subscribe((params) => {
      const empId = +params.get('id');
      if (empId) {
        this.pageTitle = 'Edit Employee';
        this.getEmployee(empId);
      } else {
        this.pageTitle = 'Create Employee';
        this.employee = {
          id: null,
          fullName: '',
          contactPreference: '',
          email: '',
          phone: null,
          skills: [],
        };
      }
    });
  }

  public getEmployee(id: number): void {
    this.employeeService.getEmployee(id).subscribe(
      (employee: IEmployee) => {
        // Store the employee object returned by the
        // REST API in the employee property
        this.employee = employee;
        this.editEmployee(employee);
      },
      (err: any) => console.log(err)
    );
  }

  public editEmployee(employee: IEmployee): void {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email,
      },
      phone: employee.phone,
    });

    this.employeeForm.setControl(
      'skills',
      this.setExistingSkills(employee.skills)
    );
  }

  public setExistingSkills(skillSets: ISkill[]): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach((s) => {
      formArray.push(
        this.fb.group({
          skillName: s.skillName,
          experienceInYears: s.experienceInYears,
          proficiency: s.proficiency,
        })
      );
    });

    return formArray;
  }

  public removeSkillButtonClick(skillGroupIndex: number): void {
    const skillsFormArray = this.employeeForm.get('skills') as FormArray;
    skillsFormArray.removeAt(skillGroupIndex);
    skillsFormArray.markAsDirty();
    skillsFormArray.markAsTouched();
  }

  public addSkillButtonClick(): void {
    (this.employeeForm.get('skills') as FormArray).push(
      this.addSkillFormGroup()
    );
  }

  public addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required],
    });
  }

  public onContactPreferenceChange(selectedValue: string): void {
    const phoneFormControl = this.employeeForm.get('phone');
    if (selectedValue === 'phone') {
      phoneFormControl.setValidators(Validators.required);
    } else {
      phoneFormControl.clearValidators();
    }
    phoneFormControl.updateValueAndValidity();
  }

  public logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
      if (
        abstractControl &&
        !abstractControl.valid &&
        (abstractControl.touched ||
          abstractControl.dirty ||
          abstractControl.value !== '')
      ) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }

  public onLoadDataClick(): void {
    this.logValidationErrors(this.employeeForm);
  }

  public onSubmit(): void {
    this.mapFormValuesToEmployeeModel();
    if (this.employee.id) {
      this.employeeService.updateEmployee(this.employee).subscribe(
        () => this.router.navigate(['list']),
        (err: Error) => console.log(err)
      );
    } else {
      this.employeeService.addEmployee(this.employee).subscribe(
        () => this.router.navigate(['list']),
        (err: Error) => console.log(err)
      );
    }
  }

  public mapFormValuesToEmployeeModel(): void {
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.contactPreference = this.employeeForm.value.contactPreference;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.skills = this.employeeForm.value.skills;
  }

  public matchEmails(group: AbstractControl): { [key: string]: any } | null {
    const emailControl = group.get('email');
    const confirmEmailControl = group.get('confirmEmail');
    if (
      emailControl.value === confirmEmailControl.value ||
      (confirmEmailControl.pristine && confirmEmailControl.value === '')
    ) {
      return null;
    } else {
      return { emailMismatch: true };
    }
  }
}
