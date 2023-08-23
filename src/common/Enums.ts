export enum VerifyCredentials {
    verify_email = 'email',
    verify_password = 'password'
}

export enum SqlType {
    SQL = 'SQL',
    NORMAL = 'NORMAL'
}

export enum SortingType {
    ID = 'ID',
    NAME = 'NAME',
    DATE = 'DATE',
    NUMBER = 'NUMBER',
    FIRST_DATE = 'FIRST_DATE',
    LAST_DATE = 'LAST_DATE'
}


export enum ValidType {
    NO_SPACE = 'NO_SPACE',
    NO_MANY_SPACE = 'NO_MANY_SPACE',
    IS_STRING = 'IS_STRING',
    IS_NUMBER = 'IS_NUMBER',
    IS_NUMBER_FLOAT = 'IS_NUMBER_FLOAT',
    NO_SPECIAL_CHARACTER = 'NO_SPECIAL_CHARACTER',
    IS_EMAIL = 'IS_EMAIL',
    DATE = 'DATE',
    DATE_BR = 'DATE_BR',

}

export enum ObjectSize {
    INTEGER = 2147483646,
    DEFAULT_DAYS = 35
}

export enum ProfileValue {
    ADMIN_VALUE = 1,
    USER_VALUE = 2
}

export enum ProfileType {
    ADMINISTRATOR = 'ADMINISTRATOR',
    USER = 'USER'
}