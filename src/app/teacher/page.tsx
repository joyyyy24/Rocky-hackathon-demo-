"use client";

import { useState } from "react";
import {
  getStudentsWithProgress,
  getClassSummary,
  getChallenges,
  getRecentActivity,
} from "@/lib/teacher-data";
import { SummaryCard } from "@/components/teacher/summary-card";
import { StudentList } from "@/components/teacher/student-list";
import { RecentActivity } from "@/components/teacher/recent-activity";
import { StudentDetailModal } from "@/components/teacher/student-detail-modal";
import { StudentWithProgress } from "@/lib/teacher-data";

export default function TeacherPage() {
  const [selectedStudent, setSelectedStudent] =
    useState<StudentWithProgress | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const students = getStudentsWithProgress();
  const summary = getClassSummary();
  const challenges = getChallenges();
  const activities = getRecentActivity();

  const handleStudentClick = (student: StudentWithProgress) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Teacher Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor student progress and manage educational activities.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8">
          <SummaryCard summary={summary} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student List - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <StudentList
              students={students}
              onStudentClick={handleStudentClick}
            />
          </div>

          {/* Recent Activity - Takes 1 column */}
          <div>
            <RecentActivity activities={activities} />
          </div>
        </div>

        {/* Student Detail Modal */}
        <StudentDetailModal
          studentWithProgress={selectedStudent}
          challenges={challenges}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}
