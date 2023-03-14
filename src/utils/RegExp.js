// const EmailPattern = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

const DigitsOnly = /^\d+$/;

const DigitAndDecimalsOnly = /^(0|[1-9]\d*)(\.\d+)?$/;

const MatchWhiteSpaceChar = /\s/;

const PasswordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[\W_]).{8,16}$/;

const EmailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const RegExp = {
	DigitsOnly,
	EmailPattern,
	PasswordPattern,
	MatchWhiteSpaceChar,
	DigitAndDecimalsOnly,
};

export {RegExp};
