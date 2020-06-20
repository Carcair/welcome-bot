class Delete {
  constructor(table_name, filter_name, filter_value) {
    this.sql = `DELETE FROM ${table_name} WHERE ${filter_name}='${filter_value}'`;
  }
}

module.exports = Delete;