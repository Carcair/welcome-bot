const helpers = {
  /**
   * Encode input
   */
  encodeInsert() {
    const self = this;
    let temp = {
      message: encodeURIComponent(self.message),
      run_date: encodeURIComponent(self.run_date),
      repeat_range: encodeURIComponent(self.repeat_range),
    };
    return temp;
  },

  /**
   * Decode output
   */
  decodeOutput() {
    let self = this;
    let temp = {
      message: decodeURIComponent(self.message),
      run_date: decodeURIComponent(self.run_date),
      repeat_range: decodeURIComponent(self.repeat_range),
    };
    return temp;
  },
};

module.exports = helpers;
