import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { items, customer_email, customer_name, success_url, cancel_url } = await req.json()

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
          metadata: {
            product_id: item.product_id,
            size: item.size || '',
          },
        },
        unit_amount: Math.round(item.price * 100), // Convert to paise
      },
      quantity: item.quantity,
    }))

    // Add shipping
    lineItems.push({
      price_data: {
        currency: 'inr',
        product_data: {
          name: 'Shipping',
        },
        unit_amount: 9900, // ₹99 in paise
      },
      quantity: 1,
    })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url,
      cancel_url,
      customer_email,
      metadata: {
        customer_name,
        items: JSON.stringify(items),
      },
    })

    // Create order in database
    const orderNumber = `ORD-${Date.now()}`
    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) + 99

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          order_number: orderNumber,
          user_id: req.headers.get('user-id'), // You'll need to pass this from the frontend
          status: 'pending',
          total_amount: totalAmount,
          shipping_amount: 99,
          tax_amount: Math.round(totalAmount * 0.18),
          payment_status: 'pending',
          stripe_payment_intent_id: session.id,
          shipping_first_name: customer_name.split(' ')[0] || '',
          shipping_last_name: customer_name.split(' ')[1] || '',
          shipping_address_1: 'Address will be updated from webhook',
          shipping_city: 'City',
          shipping_state: 'State',
          shipping_postal_code: '000000',
          shipping_country: 'India',
        },
      ])
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
    } else {
      // Create order items
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.name,
        quantity: item.quantity,
        size: item.size,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }))

      await supabase.from('order_items').insert(orderItems)
    }

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})