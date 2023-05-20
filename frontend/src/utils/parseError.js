const parseError = (error) => {
  const errorData = error.response.data;
  const message = errorData.message;
  const fields = errorData.extra.fields;
  
  let all_field_errors = [];
  Object.keys(fields).forEach((field) => {
    console.log(field)
    const field_errors = fields[field];
    all_field_errors = [...all_field_errors, ...field_errors];
  });
  
  return { message, fields, all_field_errors };
};

export default parseError;
