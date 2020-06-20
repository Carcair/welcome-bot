class Messages {
  constructor(title, text, cr_date) {
    if (title !== undefined)
      this.title = title;
    
    if (text !== undefined)
      this.text = text;

    if (cr_date !== undefined)
      this.cr_date = cr_date;
  }
}

module.exports = Messages;