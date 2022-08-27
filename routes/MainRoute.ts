import AuthRoute from '../routes/AuthRoute';
import UserRoute from '../routes/UserRoute';
import VerificationRouter from '../routes/VerificationRouter';
import PlanRoute from '../routes/PlanRoute';
import SubscriptionRoute from '../routes/SubscriptionRoute'
import ProductRoute from '../routes/ProductRoute'

require('../config/passport');

const CombineRouter = (app: any) => {
    app.use('/api/v1/auth/', AuthRoute);
    app.use('/api/v1/verification/', VerificationRouter);
    app.use('/api/v1/plans/', PlanRoute);
    app.use('/api/v1/subscriptions/', SubscriptionRoute)
    app.use('/api/v1/users/', UserRoute)
    app.use('/api/v1/products/', ProductRoute)
}

export default CombineRouter;