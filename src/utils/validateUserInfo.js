const validator = require("validator");

const validateNewUser = (reqBody) => {
  const { password, emailId, firstName, lastName } = reqBody;
  if (!firstName || !lastName) {
    throw new Error("firstName and LastName required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email-Id is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("password is not strong");
  }
};

const validateUserCredentials = (reqBody) => {
  const { password, emailId } = reqBody;
  if (!validator.isEmail(emailId)) {
    throw new Error("Email-Id is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("password is not strong");
  }
};

module.exports = { validateNewUser, validateUserCredentials };
