import { FormGroup } from "@angular/forms";

export function PasswordMismatchValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {

        const control = formGroup.get(controlName);
        const matchingControl = formGroup.get(matchingControlName);

        if (matchingControl?.errors && !matchingControl.errors['passwordMismatch']) {
            return;
        }

        if (control?.value !== matchingControl?.value) {
            matchingControl?.setErrors({ passwordMismatch: true });
        }
        else {
            matchingControl?.setErrors(null);
        }
    }
}