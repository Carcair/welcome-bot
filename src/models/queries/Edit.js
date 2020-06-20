class Edit {
  constructor(table_name, filter_name, filter_value, value_obj) {
    switch (table_name) {
      case 'messages':
        let temp = '';

        if (value_obj.title !== undefined)
          temp = temp.concat(`title='${value_obj.title}' `);
        if (value_obj.title !== undefined && value_obj.text !== undefined)
          temp = temp.concat(',');
        if (value_obj.text !== undefined)
          temp = temp.concat(`text='${value_obj.text}' `);

        this.sql = `UPDATE ${table_name} SET ${temp}WHERE ${filter_name}='${filter_value}'`;
        break;
    
      default:
        break;
    }
  }
}

module.exports = Edit;