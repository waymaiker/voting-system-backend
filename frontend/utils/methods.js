
export const toastSuccess = (title, reason) => {
  return { 
    title: "Success - "+title, 
    description: reason, 
    status: 'success', 
    duration: 5000, 
    isClosable: true 
  }
}

export const toastError = (title, reason) => {
  return { 
    title: "Error - "+title, 
    description: reason, 
    status: 'error', 
    duration: 5000, 
    isClosable: true 
  }
}