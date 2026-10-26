import { Suspense } from 'react';
import EserDetayClient from './EserDetayClient';

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <EserDetayClient params={params} />
    </Suspense>
  );
}