

export interface CodeRecoverInterface {
    name: string,
    email: string,
    code: number
}


export interface WellcomeInterface {
    name: string,
    email: string
}


export interface SendCurrentMailInterface {
    to: string,
    from: string,
    subject: string,
    html: string
}

export interface GeneralMailInterface {
    to: string,
    from: string,
    subject: string,
    html: string
}


export interface mailDataPatientInterface {
    text: string,
    patient_name: string,
    psy_mail: string,
    patient_mail: string,
    level_of_joy: number,
    level_of_disgust: number,
    level_of_fear: number,
    anger_level: number,
    level_of_surprise: number,
    level_of_sadness: number

}


export interface ChartsDataInterface {
    level_of_joy: number,
    level_of_disgust: number,
    level_of_fear: number,
    anger_level: number,
    level_of_surprise: number,
    level_of_sadness: number
}