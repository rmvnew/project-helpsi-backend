import { ProfileValue } from "src/common/Enums";

let AccessProfile = {

    USER: ProfileValue.USER_VALUE,
    USER_AND_ADMIN: [ProfileValue.USER_VALUE, ProfileValue.ADMIN_VALUE],
    ADMIN: ProfileValue.ADMIN_VALUE,

}
export default AccessProfile;