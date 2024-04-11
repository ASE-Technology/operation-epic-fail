import { HttpInterceptorFn } from '@angular/common/http';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
const accessToken = localStorage.getItem( 'token' );
const getTokenRequest = req.clone({ 
  setHeaders: {
    Authorization: `Bearer ${accessToken}`
  }
});

  return next(getTokenRequest);
};
