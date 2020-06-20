class Select {
  constructor(table_name, filter_name, filter_value) {
    if (filter_name === undefined || row_title === undefined)
      this.sql = `SELECT * FROM ${table_name}`;
    else
      this.sql = `SELECT * FROM ${table_name} WHERE ${filter_name}='${filter_value}'`;
  }
}

module.exports = Select;