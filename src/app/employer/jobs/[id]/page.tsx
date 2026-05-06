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
import { Calendar, FileText, User, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Spinner } from '@/components/ui/spinner';

// Define types based on the expected JSON response
type Application = {
  id: string;
  status: string;
  applied_at: string;
  job: {
    id: string;
    title: string;
  };
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

export default function EmployerJobDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const { data, isLoading } = useGetJobApplicants(id);

  // Ensure data is typed as Application[]
  const applications = data as Application[] | undefined;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  const jobTitle =
    applications && applications.length > 0
      ? applications[0].job.title
      : 'Detail Pekerjaan';

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'accepted':
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <>
      <Navbar />
      <section className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="mb-8 space-y-4">
          <Link
            href="/employer/jobs"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Kembali ke Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            Kandidat untuk: {jobTitle}
          </h1>
          <p className="text-muted-foreground text-lg">
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {applications.map((app) => (
              <Card
                key={app.id}
                className="overflow-hidden transition-all hover:shadow-md hover:border-primary/20"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border shrink-0">
                        {app.worker.photo_url ? (
                          <img
                            src={app.worker.photo_url}
                            alt={app.worker.full_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-primary" />
                        )}
                      </div>
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
                    </div>
                    <Badge
                      className={`${getStatusColor(app.status)} border-0 shadow-none font-medium capitalize font-sans py-1 px-2 rounded-lg`}
                    >
                      {app.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>
                        Dilamar pada:{' '}
                        <span className="text-foreground font-medium">
                          {formatDate(app.applied_at)}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="pt-4 border-t flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto flex-1 rounded-lg"
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
                    <Button className="w-full sm:w-auto flex-1 rounded-lg">
                      Tinjau Pelamar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
