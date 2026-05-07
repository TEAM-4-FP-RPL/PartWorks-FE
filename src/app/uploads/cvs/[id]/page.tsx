export default async function CVPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cvUrl = `http://localhost:3000/uploads/cvs/${id}.pdf`;

  return <iframe src={cvUrl} className="w-full h-screen" title="CV Preview" />;
}
