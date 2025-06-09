"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@/types/class-atendace-types";
import { CreateCourseSessionDialog } from "./course-session-dialog";

export default function CourseSession({ courses }: { courses: Course[] }) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Update the selected course whenever the selected course ID changes
  useEffect(() => {
    if (selectedCourseId) {
      const course =
        courses.find((c) => c.courseId.toString() === selectedCourseId) || null;
      setSelectedCourse(course);
      setSelectedClassId(""); // Reset class selection when course changes
    } else {
      setSelectedCourse(null);
    }
  }, [selectedCourseId, courses]);

  const handleCourseChange = (value: string) => {
    setSelectedCourseId(value);
  };

  const handleClassChange = (value: string) => {
    setSelectedClassId(value);
  };

  return (
    <div className="space-y-8 p-6 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>إنشاء حصة دراسية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Course Selection */}
          <div className="space-y-2">
            <label htmlFor="course-select" className="text-sm font-medium">
              إختر الدرس
            </label>
            <Select value={selectedCourseId} onValueChange={handleCourseChange}>
              <SelectTrigger id="course-select">
                <SelectValue placeholder="إختر الدرس" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                {courses.map((course) => (
                  <SelectItem
                    key={course.courseId}
                    value={course.courseId.toString()}
                  >
                    {course.courseName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Class Selection - Only show if a course is selected */}
          {selectedCourse && (
            <div className="space-y-2">
              <label htmlFor="class-select" className="text-sm font-medium">
                إختر القسم
              </label>
              <Select value={selectedClassId} onValueChange={handleClassChange}>
                <SelectTrigger id="إختر القسم">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {selectedCourse.classes.map((cls) => (
                    <SelectItem
                      key={cls.classId}
                      value={cls.classId.toString()}
                    >
                      {cls.className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Display selected course and class */}
          {selectedCourse && selectedClassId && (
            <CreateCourseSessionDialog
              classId={selectedClassId}
              courseId={selectedCourseId}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
