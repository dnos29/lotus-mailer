import { NextApiRequest, NextApiResponse } from "next"
import * as nodemailer from 'nodemailer';
const hbs = require('nodemailer-express-handlebars');
import * as path from 'path';
import supabase from "../../utils/supabase";
import dayjs from 'dayjs';

type ResponseData = {
  message: string
}
const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve('./email-templates/'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./email-templates/')
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  console.log(`Reminder cron running at: ${dayjs().format('YYYY-MM-DD')}`);
  const {data: orders} = await supabase.from('orders').select().eq('due_date', dayjs().format('YYYY-MM-DD'));
  for (let i = 0; i < (orders?.length || 0); i++) {
    const order = orders?.[i];
    await sendEmail(order);
  }
  res.status(200).json({ message: 'send-reminder' })
}

async function sendEmail(order: any){
  const orderData = JSON.parse(order?.raw_request);
  const {customer, shipping_address} = orderData;

  let transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    secure: true,
    port: 465,
    auth: {
      user: "hello@lotuscommunity.org.vn",
      pass: "BSHjG1AeexZ1",
    },
  });
  transporter.use('compile', hbs(handlebarOptions));

  const mailOptions = {
    from: "hello@lotuscommunity.org.vn", // sender address
    to: customer?.email,
    subject: "Review reminder",
    // html: `<p>test</p>,`,
    template: 'review-reminder',
    context: {
      name: `${shipping_address?.first_name} ${shipping_address?.last_name}`,
    },
  };
  await transporter.sendMail(mailOptions, function(err: any, info: any) {
    if(err){
      console.log(`err: `, err);
    }
    console.log(`info: `, info);
  });
}