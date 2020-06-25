class Messages {
  constructor(title, text, cr_date) {
    this.title = title;
    this.text = text;
    if (cr_date !== undefined)
      this.cr_date = cr_date;
  }

  /**
   * Checking regular expressions, blocking input with unauthorized input
   */
  checkInsert() {
    // Check title
    if (this.title.length < 5 || this.title.length > 30) return false;
    if (! /^[a-zA-Z0-9]+$/.test(this.title)) return false;

    // Check text
    if (this.text.length < 20 || this.text.length > 300) return false;
    if (! /^[a-zA-Z0-9.,"'!?@:-_\sšŠđĐžŽćĆčČ]+$/.test(this.text)) return false;

    // Check date format and range
    if (this.cr_date !== undefined) {
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(this.cr_date)) return false;
    }

    return true;
  }

  /**
   * Encoding input before sending as a query, escaping special characters
   */
  encodeInsert() {
    const self = this;
    let temp = {
      title: encodeURIComponent(self.title),
      text: encodeURIComponent(self.text),
      cr_date: undefined
    };
    if (this.cr_date !== undefined) temp.cr_date = encodeURIComponent(self.cr_date);

    return temp;
  }

  /**
   * Decoding output from MySQL before sending it to front-end
   */
  decodeOutput() {
    let self = this;
    let temp = {
      title: decodeURIComponent(self.title),
      text: decodeURIComponent(self.text),
      cr_date: decodeURIComponent(self.cr_date)
    };
    return temp;
  }
}

module.exports = Messages;