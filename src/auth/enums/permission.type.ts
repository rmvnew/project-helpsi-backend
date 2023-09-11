import { ProfileValue } from "src/common/Enums";

let AccessProfile = {

    ADMIN: ProfileValue.ADMIN_VALUE,
    PATIENT: ProfileValue.PATIENT_VALUE,
    PSYCHOLOGIST: ProfileValue.PSYCHOLOGIST_VALUE,
    ATTENDANT: ProfileValue.ATTENDANT_VALUE,
    ADMIN_PATIENT: [
        ProfileValue.ADMIN_VALUE,
        ProfileValue.PATIENT_VALUE
    ],
    PATIENT_PSYCHOLOGIST: [
        ProfileValue.PATIENT_VALUE,
        ProfileValue.PSYCHOLOGIST_VALUE
    ],
    ADMIN_PATIENT_PSYCHOLOGIST: [
        ProfileValue.ADMIN_VALUE,
        ProfileValue.PATIENT_VALUE,
        ProfileValue.PSYCHOLOGIST_VALUE
    ],
    ADMIN_PSYCHOLOGIST: [
        ProfileValue.ADMIN_VALUE,
        ProfileValue.PSYCHOLOGIST_VALUE
    ],
    ADMIN_PSYCHOLOGIST_ATTENDANT: [
        ProfileValue.ATTENDANT_VALUE,
        ProfileValue.ADMIN_VALUE,
        ProfileValue.PSYCHOLOGIST_VALUE
    ],
    ALL: [
        ProfileValue.ADMIN_VALUE,
        ProfileValue.PATIENT_VALUE,
        ProfileValue.ATTENDANT_VALUE,
        ProfileValue.PSYCHOLOGIST_VALUE
    ]

}
export default AccessProfile;