import { FormGroup } from "@angular/forms";

export const isRequired = (field: string, form: FormGroup) => {
    const control = form.get(field);
    return control && control.hasError('required')
};

export const hasEmailError = (field: string, form: FormGroup) => {
    const control = form.get(field);
    return control && control?.touched && control.hasError('email')
}

export const hasSixDigits = (field: string, form: FormGroup) => {
    const control = form.get(field);
    return control && control?.touched && control.hasError('minlength')
    
}
