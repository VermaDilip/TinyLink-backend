import { CODE_REGEX } from '../constants/regex.js';
import { MESSAGES } from '../constants/messages.js';
import { STATUS } from '../constants/apiStatus.js';

const validateCode = (req, res, next) => {
  const { code } = req.params;
  if (!CODE_REGEX.test(code)) {
    return res.status(STATUS.BAD_REQUEST).json({ error: MESSAGES.INVALID_CODE });
  }
  next();
};

export default validateCode;