import { NextApiRequest, NextApiResponse } from "next"
import supabase from "../../utils/supabase";
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday);

type ResponseData = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  return await supabase.from('orders').insert({
    order_id: req.body?.id,
    raw_request: JSON.stringify(req.body),
    due_date: dayjs().weekday(3),
  });
}