class Schedules {
  constructor(message, run_date, repeat_range) {
    this.message = message;
    this.run_date = run_date;
    this.repeat_range = repeat_range;
  }

  /**
   * Check regular exp, block unathorized
   */
  checkInsert() {
    // Check message name
    if (this.message.length < 5 || this.message.length > 30) return false;
    if (!/^[a-zA-Z0-9]+$/.test(this.message)) return false;

    // Check date format and range for date of running
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(this.run_date)) return false;

    // Check repeat range 0 for no repeat, 1 one day, 3 three days, 7 week, 30 month
    if (this.repeat_range.length > 2) return false;
    if (!/[0-9]$/.test(this.repeat_range)) return false;

    return true;
  }

  /**
   * Encode input before sending query
   */
  encodeInsert() {
    const self = this;
    let temp = {
      message: encodeURIComponent(self.message),
      run_date: encodeURIComponent(self.run_date),
      repeat_range: encodeURIComponent(self.repeat_range),
    };
    return temp;
  }

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
  }
}

module.exports = Schedules;
