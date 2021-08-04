const { PhoneNumberUtil } = require("google-libphonenumber");

module.exports = {
  validatePhoneNumber(phone, country = "UG") {
    try {
      const phoneUtil = PhoneNumberUtil.getInstance();
      const number = phoneUtil.parseAndKeepRawInput(phone, country);
      return phoneUtil.isValidNumberForRegion(number, country);
    } catch (e) {
      return false;
    }
  },
};
