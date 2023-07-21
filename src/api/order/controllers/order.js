'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({strapi}) => ({
    async create(ctx) {
        const result = await super.create(ctx)
        
        console.log('result',result)

        // -------Get Snap Token
        const midtransClient = require('midtrans-client');
        // Create Snap API instance
        let snap = new midtransClient.Snap({
                isProduction : false,
                serverKey : 'SB-Mid-server-v4_-jXC9VmOZDp_1OGKRubNp',
                clientKey : 'SB-Mid-client-6k7KmEJLSbS3TOUf'
            });

        let parameter = {
            "transaction_details": {
                "order_id": result.data.id,
                "gross_amount": result.data.attributes.totalPrice
            }, "credit_card":{
                "secure" : true
            }
        };

        let response = await snap.createTransaction(parameter)

        // ----CORE API
        // const midtransClient = require('midtrans-client');
        // // Create Core API instance
        // let core = new midtransClient.CoreApi({
        //         isProduction : false,
        //         serverKey : 'SB-Mid-server-v4_-jXC9VmOZDp_1OGKRubNp',
        //         clientKey : 'SB-Mid-client-6k7KmEJLSbS3TOUf'
        //     });

        // let parameter = {
        //     "payment_type": "gopay",
        //     "transaction_details": {
        //         "gross_amount": result.data.attributes.totalPrice,
        //         "order_id": result.data.id,
        //     },
        //     "gopay_partner": {
        //         "phone_number": "81212345678",
        //         "country_code": "62",
        //         "redirect_url": "https://www.gojek.com"
        //       }
        // };

        // // charge transaction
        // let response = await core.charge(parameter)

        return response;
    }
}) );
