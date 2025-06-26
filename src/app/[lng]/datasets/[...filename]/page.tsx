import { redirect } from 'next/navigation';

interface DatasetsCatchAllPageProps {
  params: { filename: string[] };
}

export default function DatasetsCatchAllPage({
  params,
}: DatasetsCatchAllPageProps) {
  const slugPath = params.filename.join('/');
  redirect(`/downloads/${slugPath}`);
}
