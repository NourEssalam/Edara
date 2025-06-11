import Container from "@/components/custom-ui/common/Container";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  User,
  MapPin,
  Phone,
  FileText,
  Clock,
  Hash,
  Award,
  Briefcase,
} from "lucide-react";
import { RefuseRequestDialog } from "@/components/custom-ui/requests/refuse-dialog";
import { getSession } from "@/lib/session";
import { RequestIdentifier } from "@/types/request-types";
import { translateRequestStatus } from "@/lib/translations/enums";
import { RequestStatus } from "@repo/shared-types";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string[] }>;
}) {
  const { id } = await params;
  const userId = id[0];
  const requestId = id[1];
  const session = await getSession();

  const requestIdentifier: RequestIdentifier = {
    requestId: requestId as string,
    userId: userId as string,
    adminId: session?.user.id as string,
  };

  const requestDetails = await authFetch(
    `${BACKEND_URL}/leave-requests/get-request-details/${userId}/${requestId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await requestDetails.json();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Container className="flex flex-col gap-6 overflow-hidden py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            تفاصيل مطلب العطلة
          </h1>
        </div>
        <Badge className={getStatusColor(data.requestStatus)}>
          {translateRequestStatus(
            RequestStatus[data.requestStatus as keyof typeof RequestStatus]
          )}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Employee Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              معلومات الموظف
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  الاسم
                </p>
                <p className="text-sm">{data.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  المعرف
                </p>
                <p className="text-sm flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  {data.matricule}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  الرتبة
                </p>
                <p className="text-sm flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {data.grade}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  الخطة الوظيفية
                </p>
                <p className="text-sm flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {data.jobPlan || "غير متوفر"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leave Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              معلومات العطلة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                نوع العطلة
              </p>
              <p className="text-sm font-semibold">{data.leaveType}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">من</p>
                <p className="text-sm">{formatDate(data.durationFrom)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">إلى</p>
                <p className="text-sm">{formatDate(data.durationTo)}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                سنة العطلة
              </p>
              <p className="text-sm">{data.leaveYear}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              معلومات الاتصال
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                الهاتف
              </p>
              <p className="text-sm">{data.phone}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                عنوان العطلة
              </p>
              <p className="text-sm flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                {data.leaveAddress}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                الرمز البريدي
              </p>
              <p className="text-sm">{data.postalCode}</p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              تفاصيل إضافية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                نص الفائدة
              </p>
              <p className="text-sm leading-relaxed">{data.benefitText}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                الوثائق المرفقة
              </p>
              <p className="text-sm">{data.attachedDocs}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                تاريخ الإنشاء
              </p>
              <p className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {formatDate(data.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      {data.requestStatus === "PENDING" && (
        <Card>
          <CardHeader>
            <CardTitle>الإجراءات</CardTitle>
            <CardDescription>
              قم بمراجعة هذا المطلب واتخاذ إجراء
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button className="bg-green-600 hover:bg-green-700">
                الموافقة على المطلب
              </Button>
              <RefuseRequestDialog requestIdentifier={requestIdentifier} />
              <Button variant="outline">طلب معلومات إضافية</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
