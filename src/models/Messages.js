class Messages {
  constructor(title, text, cr_date) {
    this.title = title;
    
    this.text = text;

    if (cr_date !== undefined)
      this.cr_date = cr_date;
  }
}

module.exports = Messages;