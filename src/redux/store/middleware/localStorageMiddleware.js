const localStorageMiddleware = store => next => action => {
    const result = next(action);
    
    if (action.type.startsWith('availability/')) {
      localStorage.setItem('availability', JSON.stringify(store.getState().availability.slots));
    }
    
    if (action.type.startsWith('bookings/')) {
      localStorage.setItem('bookings', JSON.stringify(store.getState().bookings.bookings));
    }
    
    if (action.type.startsWith('links/')) {
      localStorage.setItem('links', JSON.stringify(store.getState().links.links));
    }
    
    return result;
  };
  
  export default localStorageMiddleware;