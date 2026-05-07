'use client';

import { useGetJobApplicants } from '@/features/employer/hooks/useGetJobApplicants';
import { useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  FileText,
  User,
  ChevronLeft,
  MapPin,
  Banknote,
} from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Spinner } from '@/components/ui/spinner';
import { useGetJobById } from '@/features/jobs/hooks/useGetJobById';
import { EmployerJob } from '@/features/jobs/types';

type Application = {
  id: string;
  status: string;
  applied_at: string;
  worker: {
    id: string;
    full_name: string;
    photo_url: string;
  };
  cv: {
    id: string;
    file_url: string;
    category: {
      id: number;
      name: string;
    };
  };
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'sent':
      return 'bg-blue-100 text-blue-800';
    case 'viewed':
      return 'bg-yellow-100 text-yellow-800';
    case 'called':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (dateString: string) =>
  new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateString));

export default function EmployerJobDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const { data, isLoading } = useGetJobApplicants(id);
  const { data: job, isLoading: isLoadingJob } = useGetJobById(id);

  const applications = data as Application[] | undefined;
  const jobDetail = job as EmployerJob | undefined;

  return (
    <>
      <Navbar />
      {isLoading || isLoadingJob ? (
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      ) : (
        <section className="container mx-auto py-8 px-4 max-w-5xl">
          <div className="mb-8 space-y-4">
            <Link
              href="/employer/jobs"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Kembali ke Dashboard
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {jobDetail?.title}
              </h1>
              <Badge
                className={`w-fit ${jobDetail?.status === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'} uppercase text-xs px-3 py-1`}
              >
                {jobDetail?.status}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {jobDetail?.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Banknote className="w-4 h-4" /> Rp{' '}
                {jobDetail?.salary.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" /> {applications?.length ?? 0} pelamar
              </span>
            </div>

            <p className="text-muted-foreground">
              Daftar pekerja yang telah melamar pekerjaan ini.
            </p>
          </div>

          {!applications || applications.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
              <User className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-medium text-foreground">
                Belum ada pelamar
              </h3>
              <p className="text-muted-foreground mt-2">
                Pekerjaan ini belum menerima lamaran apapun.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {applications.map((app) => (
                <Card
                  key={app.id}
                  className="overflow-hidden transition-all hover:shadow-md hover:border-primary/20"
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl capitalize font-sans">
                          {app.worker.full_name}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Badge
                            variant="secondary"
                            className="font-normal text-xs"
                          >
                            {app.cv.category.name}
                          </Badge>
                        </CardDescription>
                      </div>
                      <Badge
                        className={`${getStatusColor(app.status)} border-0 shadow-none font-medium capitalize font-sans py-1 px-2 rounded-lg`}
                      >
                        {app.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      Dilamar pada:{' '}
                      <span className="text-foreground font-medium ml-1">
                        {formatDate(app.applied_at)}
                      </span>
                    </div>
                    <div className="pt-4 border-t flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 rounded-lg"
                        asChild
                      >
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL}/${app.cv.file_url}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Lihat CV
                        </a>
                      </Button>
                      <Button className="flex-1 rounded-lg" asChild>
                        <Link href={`/employer/applicants/${app.id}`}>
                          Tinjau Pelamar
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}
