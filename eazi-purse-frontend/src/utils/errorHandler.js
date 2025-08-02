// Utility function to parse error messages from API responses
export const parseErrorMessage = (error) => {
  if (!error || !error.data) {
    return 'An unexpected error occurred. Please try again.';
  }

  const { data } = error;
  
  if (typeof data === 'string') {
    return data;
  }
  
  if (data.message) {
    return data.message;
  }
  
  if (data.detail) {
    return data.detail;
  }
  
  if (typeof data === 'object') {
    const errorMessages = [];
    
    Object.keys(data).forEach(field => {
      const fieldErrors = data[field];
      if (Array.isArray(fieldErrors)) {
        fieldErrors.forEach(errorMsg => {
          errorMessages.push(`${errorMsg}`);
        });
      } else if (typeof fieldErrors === 'string') {
        errorMessages.push(`${fieldErrors}`);
      }
    });
    
    if (errorMessages.length > 0) {
      return errorMessages.join('\n');
    }
  }
  
  if (data.non_field_errors) {
    return data.non_field_errors.join('\n');
  }
  
  return 'An error occurred. Please try again.';
};

export const showErrorMessages = (error, toast) => {
  const errorMessage = parseErrorMessage(error);
  
  const messages = errorMessage.split('\n');
  
  if (messages.length === 1) {
    toast.error(messages[0]);
  } else {
    toast.error(messages[0]);
    messages.slice(1).forEach((message, index) => {
      setTimeout(() => {
        toast.error(message);
      }, (index + 1) * 1000);
    });
  }
}; 