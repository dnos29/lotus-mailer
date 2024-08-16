import { NextApiRequest, NextApiResponse } from "next"
import supabase from "../../utils/supabase";

type ResponseData = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const rs = await supabase.from('orders')
  .delete()
  .eq('order_id', req.body?.id);
  console.log('rs:', rs);
  res.status(200).json({ message: 'Order deleted' })
}
