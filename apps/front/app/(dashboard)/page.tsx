import Container from "@/components/custom-ui/common/Container";
import Link from "next/link";
import { Calendar, FileText, ArrowRight, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function MainPage() {
  return (
    <Container className="flex flex-col gap-8 overflow-hidden">
      <h1 className="text-2xl text-center font-bold">خدمات على الخط</h1>
      <div className="flex justify-center ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Leave Request Card */}
          <Link href="/leave-request" className="block">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer border-2 hover:border-primary/20">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold">
                  طلب عطلة
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base mb-4">
                  قدم طلب عطلتك السنوية، أو المرضية، أو الخاصة. تتبّع رصيد
                  العطلات المتبقية واحصل على حالة الموافقة مباشرة.
                </CardDescription>
                <div className="flex items-center justify-center text-primary font-medium">
                  <span className="mr-2">ابدأ الطلب</span>
                  <ArrowLeft className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Work Certification Request Card */}
          <Link href="/work-certification-request" className="block">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer border-2 hover:border-primary/20">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl font-semibold">
                  طلب شهادة عمل
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base mb-4">
                  اطلب شهادة عمل رسمية، أو شهادة تثبت العمل، أو شهادة راتب
                  لأغراض بنكية، تأشيرة، أو أي معاملات رسمية أخرى.
                </CardDescription>
                <div className="flex items-center justify-center text-primary font-medium">
                  <span className="mr-2">ابدأ الطلب</span>
                  <ArrowLeft className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </Container>
  );
}
