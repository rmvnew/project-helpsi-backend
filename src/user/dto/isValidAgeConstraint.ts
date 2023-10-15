import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { differenceInYears, parse } from 'date-fns';

@ValidatorConstraint({ async: false })
export class IsValidAgeConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        try {
            const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
            const currentDate = new Date();
            const age = differenceInYears(currentDate, parsedDate);
            return age >= 4 && age <= 100;
        } catch (error) {
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        return 'A idade deve estar entre 4 e 100 anos.';
    }
}
