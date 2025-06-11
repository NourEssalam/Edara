import Container from "@/components/custom-ui/common/Container";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { Calendar, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";

export default async function PendingRequests() {
  const pendindRequests = await authFetch(
    `${BACKEND_URL}/leave-requests/pending-leave-requests`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await pendindRequests.json();

  // console.log(data);

  return (
    <Container className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl text-center">مطالب العطل قيد الانتظار</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {data.map((request: any) => (
          <Card key={request.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {request.leaveType}
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800"
                >
                  {request.requestStatus}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {request.userName}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {request.durationFrom} - {request.durationTo}
                </span>
              </div>

              {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{request.leaveAddress}</span>
              </div> */}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{request.phone}</span>
              </div>

              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-2">
                  المعرف: {request.matricule}
                </p>
                {/* <p className="text-sm line-clamp-2">{request.benefitText}</p> */}
              </div>

              <div className="pt-4">
                <Link
                  href={`/pending-leave-requests/${request.userId}/${request.id}`}
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                >
                  عرض التفاصيل
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            لم يتم العثور على مطالب قيد الانتظار.
          </p>
        </div>
      )}
    </Container>
  );
}
