
import { createRef } from "react";

import { toast } from 'react-toastify';

export const toastRef = createRef();

// COMMENT
export const ShowToast = (message, type = 'info') => {
  switch (type) {
    case 'success':
      toast.success(message);
      break;
    case 'error':
      toast.error(message);
      break;
    case 'warning':
      toast.warn(message);
      break;
    case 'info':
    default:
      toast.info(message);
      break;
  }
};
