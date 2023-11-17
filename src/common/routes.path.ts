


export function getUserPath() {
    return `${process.env.SWAGGER_API_URL}/v1/user`
}

export function getUserPatientPath() {
    return `${process.env.SWAGGER_API_URL}/v1/user/all-patients`
}

export function getUserPatientByPsychologistPath() {
    return `${process.env.SWAGGER_API_URL}/v1/user/all-patients/psychologist`
}

export function getDiaryEntryPath() {
    return `${process.env.SWAGGER_API_URL}/v1/diary-entry`
}

export function getUnavailablePath() {
    return `${process.env.SWAGGER_API_URL}/v1/unavailable-times`
}

export function schedulingPath() {
    return `${process.env.SWAGGER_API_URL}/v1/scheduling`
}



