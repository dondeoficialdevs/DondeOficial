import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const { event, data } = payload;

        // Wompi sends events like 'transaction.updated'
        if (event === 'transaction.updated') {
            const transaction = data.transaction;
            const requestId = transaction.reference;
            const status = transaction.status; // APPROVED, DECLINED, VOIDED
            const paymentMethod = transaction.payment_method_type;
            const transactionId = transaction.id;

            console.log(`Processing Wompi transaction ${transactionId} for request ${requestId} with status ${status}`);

            // 1. Obtener la solicitud original
            const { data: membershipRequest, error: requestError } = await supabase
                .from('membership_requests')
                .select('*')
                .eq('id', requestId)
                .single();

            if (requestError || !membershipRequest) {
                console.error('Error finding membership request:', requestError);
                return NextResponse.json({ error: 'Request not found' }, { status: 404 });
            }

            // 2. Actualizar el estado de la solicitud
            const newStatus = status === 'APPROVED' ? 'completed' : (status === 'DECLINED' ? 'cancelled' : 'pending');

            const { error: updateError } = await supabase
                .from('membership_requests')
                .update({
                    status: newStatus,
                    transaction_id: transactionId,
                    payment_method: paymentMethod,
                    updated_at: new Date().toISOString()
                })
                .eq('id', requestId);

            if (updateError) {
                console.error('Error updating membership request:', updateError);
                throw updateError;
            }

            // 3. Si el pago fue aprobado, activar la membresía en el negocio
            if (status === 'APPROVED' && membershipRequest.business_id) {
                // Obtener el plan para conocer el nivel
                const { data: plan } = await supabase
                    .from('membership_plans')
                    .select('level')
                    .eq('id', membershipRequest.plan_id)
                    .single();

                if (plan) {
                    const { error: businessError } = await supabase
                        .from('businesses')
                        .update({
                            membership_id: membershipRequest.plan_id,
                            level: plan.level
                        })
                        .eq('id', membershipRequest.business_id);

                    if (businessError) {
                        console.error('Error updating business level:', businessError);
                    } else {
                        console.log(`Business ${membershipRequest.business_id} upgraded to level ${plan.level}`);
                    }
                }
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
