class Insert {
  constructor(table_name, value_obj) {
    switch (table_name) {
      case 'messages':
        this.sql = `INSERT INTO messages(title, text, cr_date) VALUES ('${value_obj.title}', '${value_obj.text}', '${value_obj.cr_date}')`;
        break;
    
      default:
        break;
    }
  }
}

module.exports = Insert;