export default function EventPage({
  params,
}: {
  params: { slug: string };
}) {
  return <h1>Event: {params.slug}</h1>;
}
