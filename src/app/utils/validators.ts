import { FormGroup } from "@angular/forms";
import {ErrorStateMatcher} from '@angular/material/core';


export const isRequired = (field: string, form: FormGroup) => {
    const control = form.get(field);
    return control && control.hasError('required')
};

export const hasEmailError = (form: FormGroup) => {
    const control = form.get('correo');
    return control && control?.touched && control.hasError('email')
}


