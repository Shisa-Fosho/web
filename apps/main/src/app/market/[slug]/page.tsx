export default function MarketPage({
  params,
}: {
  params: { slug: string };
}) {
  return <h1>Market: {params.slug}</h1>;
}
