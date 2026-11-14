import { AbstractControl } from '@angular/forms';

/** Mostra o erro só depois que o usuário interagiu com o campo */
export const showInvalid = (control: AbstractControl | null): boolean =>
    !!control && control.invalid && (control.touched || control.dirty);