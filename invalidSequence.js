const invalidSequenceType = "Invalid sequence";
class InvalidSequenceError {
  type = invalidSequenceType;
  message = "Current value is not equal to value in zookeeper";
}

module.exports = {
  InvalidSequenceError,
  invalidSequenceType,
};
