
var t = require('tcomb');

// enum
var Locale = t.enums.of('it_IT en_US');

// a struct is a type containing properties (i.e. a class)
var action = t.struct({
  username: t.Str,          // string type
  locale:   t.maybe(Locale) // maybe means optional
});

var SignUpOutput = t.struct({
  id:       t.Num,          // number type
  username: t.Str,
  locale:   t.maybe(Locale)
});

module.exports = {
  Locale:       Locale,
  SignUpOutput: SignUpOutput
};