import { Router, Request, Response } from 'express';

import auth from '@routes/authRoute';
import oauth from '@routes/oAuthRoute';

const route = Router();

route.use('/', auth);
route.use('/oauth', oauth);

route.get('/', (req: Request, res: Response) => {
  req.session.user ? res.redirect('/oauth/register') : res.render('main');
});

export default route;
