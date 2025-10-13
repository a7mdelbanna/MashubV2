'use client'

import { useState } from 'react'
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Award, Clock, Download, Send, Plus, MoreVertical, Star, Edit, CheckCircle2, XCircle, AlertCircle, FileText, Video, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { Candidate, Interview, Assessment } from '@/types/candidates'
import {
  getCandidateStatusColor,
  getExperienceLevelColor,
  getInterviewStageColor,
  getInterviewStatusColor,
  formatCandidateStatus,
  formatExperienceLevel,
  formatInterviewStage,
  formatSalaryRange,
  formatNoticePeriod,
  calculateDaysInProcess,
  calculateOverallScore
} from '@/lib/candidates-utils'

// Mock candidate data
const mockCandidate: Candidate = {
  id: 'cand-1',
  tenantId: 'tenant-1',
  firstName: 'Sarah',
  lastName: 'Johnson',
  fullName: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  phone: '+1 (555) 123-4567',
  alternatePhone: '+1 (555) 123-4568',
  location: { city: 'San Francisco', state: 'CA', country: 'USA' },
  timezone: 'America/Los_Angeles',
  currentJobTitle: 'Senior Full Stack Developer',
  currentCompany: 'TechCorp Inc',
  yearsOfExperience: 8,
  experienceLevel: 'senior',
  expectedSalary: { min: 140000, max: 160000, currency: 'USD' },
  noticePeriod: 30,
  positionId: 'pos-1',
  positionTitle: 'Lead Developer',
  department: 'Engineering',
  status: 'interview',
  applicationDate: '2025-10-01T10:00:00Z',
  source: 'linkedin',
  resumeUrl: '/resumes/sarah-johnson.pdf',
  linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
  githubUrl: 'https://github.com/sarahj',
  portfolioUrl: 'https://sarahjohnson.dev',
  skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'PostgreSQL', 'Redis', 'GraphQL'],
  certifications: ['AWS Solutions Architect', 'PMP'],
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      institution: 'Stanford University',
      location: 'Stanford, CA',
      startDate: '2011-09',
      endDate: '2015-06',
      isCurrent: false,
      grade: '3.8 GPA'
    }
  ],
  languages: [
    { language: 'English', proficiency: 'native' },
    { language: 'Spanish', proficiency: 'conversational' }
  ],
  interviews: [
    {
      id: 'int-1',
      candidateId: 'cand-1',
      stage: 'phone_screen',
      status: 'completed',
      scheduledAt: '2025-10-05T14:00:00Z',
      duration: 60,
      timezone: 'PST',
      interviewers: [
        { userId: 'usr-1', name: 'John Doe', email: 'john@company.com', role: 'Recruiter', isPrimary: true }
      ],
      completedAt: '2025-10-05T15:00:00Z',
      feedback: [
        {
          interviewerId: 'usr-1',
          interviewerName: 'John Doe',
          rating: 4.5,
          categories: { communication: 5, technical: 4, cultureFit: 5 },
          strengths: ['Excellent communication', 'Strong technical background'],
          weaknesses: ['Limited experience with Kubernetes'],
          comments: 'Very impressive candidate. Strong technical skills and great culture fit.',
          recommendation: 'strong_yes',
          submittedAt: '2025-10-05T16:00:00Z'
        }
      ],
      overallRating: 4.5,
      recommendation: 'strong_yes',
      createdAt: '2025-10-03',
      updatedAt: '2025-10-05',
      createdBy: 'rec-1'
    },
    {
      id: 'int-2',
      candidateId: 'cand-1',
      stage: 'technical',
      status: 'scheduled',
      scheduledAt: '2025-10-20T14:00:00Z',
      duration: 90,
      timezone: 'PST',
      meetingLink: 'https://zoom.us/j/123456789',
      interviewers: [
        { userId: 'usr-2', name: 'Jane Smith', email: 'jane@company.com', role: 'Tech Lead', isPrimary: true },
        { userId: 'usr-3', name: 'Bob Wilson', email: 'bob@company.com', role: 'Senior Engineer', isPrimary: false }
      ],
      createdAt: '2025-10-10',
      updatedAt: '2025-10-10',
      createdBy: 'rec-1'
    }
  ],
  assessments: [
    {
      id: 'ass-1',
      candidateId: 'cand-1',
      type: 'technical',
      title: 'React & Node.js Coding Challenge',
      description: 'Build a full-stack application with authentication',
      assignedAt: '2025-10-06T10:00:00Z',
      startedAt: '2025-10-07T09:00:00Z',
      completedAt: '2025-10-08T16:00:00Z',
      dueDate: '2025-10-10T23:59:59Z',
      duration: 240,
      score: 90,
      maxScore: 100,
      percentage: 90,
      passed: true,
      notes: 'Excellent code quality, well-structured architecture',
      createdAt: '2025-10-06'
    }
  ],
  assignedTo: {
    recruiterId: 'rec-1',
    recruiterName: 'Emily Davis',
    recruiterEmail: 'emily.davis@company.com'
  },
  hiringManager: {
    managerId: 'mgr-1',
    managerName: 'Michael Chen',
    managerEmail: 'michael.chen@company.com'
  },
  notes: [
    {
      id: 'note-1',
      content: 'Excellent technical skills. Strong culture fit. Highly recommend moving forward.',
      createdBy: 'rec-1',
      createdByName: 'Emily Davis',
      createdAt: '2025-10-05T17:00:00Z',
      isPrivate: false
    },
    {
      id: 'note-2',
      content: 'Discussed salary expectations. Within budget range.',
      createdBy: 'rec-1',
      createdByName: 'Emily Davis',
      createdAt: '2025-10-08T11:00:00Z',
      isPrivate: true
    }
  ],
  emails: [
    {
      id: 'email-1',
      subject: 'Interview Invitation - Lead Developer Position',
      from: 'emily.davis@company.com',
      to: 'sarah.johnson@email.com',
      sentAt: '2025-10-03T10:00:00Z',
      opened: true,
      openedAt: '2025-10-03T11:30:00Z'
    }
  ],
  calls: [
    {
      id: 'call-1',
      type: 'outgoing',
      duration: 900,
      date: '2025-10-02T14:00:00Z',
      notes: 'Initial screening call. Discussed role requirements and candidate background.'
    }
  ],
  tags: ['Hot Candidate', 'Senior', 'Full Stack'],
  priority: 'high',
  isBookmarked: true,
  screeningScore: 4.5,
  cultureFitScore: 4.8,
  overallScore: 4.5,
  nextFollowUpAt: '2025-10-20T14:00:00Z',
  createdAt: '2025-10-01T10:00:00Z',
  updatedAt: '2025-10-13T16:00:00Z',
  lastActivityAt: '2025-10-13T16:00:00Z',
  lastContactedAt: '2025-10-08T11:00:00Z'
}

type TabType = 'overview' | 'interviews' | 'assessments' | 'activity'

export default function CandidateDetailPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const candidate = mockCandidate

  const daysInProcess = calculateDaysInProcess(candidate.applicationDate)

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/candidates">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
            </Link>

            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-2xl">
              {candidate.firstName[0]}{candidate.lastName[0]}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold text-white">{candidate.fullName}</h1>
                {candidate.isBookmarked && <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
              </div>
              <p className="text-gray-400">{candidate.currentJobTitle} at {candidate.currentCompany}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <Mail className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <Phone className="w-5 h-5 text-gray-400" />
            </button>
            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors">
              <Calendar className="w-4 h-4" />
              Schedule Interview
            </button>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors">
              <Send className="w-4 h-4" />
              Send Email
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-6 gap-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Status</div>
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getCandidateStatusColor(candidate.status)}`}>
              {formatCandidateStatus(candidate.status)}
            </span>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Experience</div>
            <div className="text-white font-medium">{candidate.yearsOfExperience} years</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Overall Score</div>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-medium">{candidate.overallScore}/5</span>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">In Process</div>
            <div className="text-white font-medium">{daysInProcess} days</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Interviews</div>
            <div className="text-white font-medium">{candidate.interviews.length}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Assessments</div>
            <div className="text-white font-medium">{candidate.assessments.length}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="col-span-8">
          {/* Tabs */}
          <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-1 mb-6">
            <div className="flex gap-1">
              {['overview', 'interviews', 'assessments', 'activity'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as TabType)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-400">Email</div>
                        <div className="text-white">{candidate.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-400">Phone</div>
                        <div className="text-white">{candidate.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-400">Location</div>
                        <div className="text-white">{candidate.location.city}, {candidate.location.state}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-400">Notice Period</div>
                        <div className="text-white">{formatNoticePeriod(candidate.noticePeriod!)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Experience */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Professional Summary</h3>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Current Position</div>
                        <div className="text-white font-medium">{candidate.currentJobTitle}</div>
                        <div className="text-sm text-gray-400">{candidate.currentCompany}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Experience Level</div>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getExperienceLevelColor(candidate.experienceLevel)}`}>
                          {formatExperienceLevel(candidate.experienceLevel)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Years of Experience</div>
                        <div className="text-white">{candidate.yearsOfExperience} years</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Expected Salary</div>
                        <div className="text-white">
                          {formatSalaryRange(candidate.expectedSalary!.min, candidate.expectedSalary!.max, candidate.expectedSalary!.currency)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                {candidate.education.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Education</h3>
                    {candidate.education.map(edu => (
                      <div key={edu.id} className="bg-gray-800/50 rounded-lg p-4">
                        <div className="font-medium text-white">{edu.degree} in {edu.field}</div>
                        <div className="text-sm text-gray-400">{edu.institution} • {edu.location}</div>
                        <div className="text-sm text-gray-400 mt-1">{edu.startDate} - {edu.endDate} • {edu.grade}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Certifications */}
                {candidate.certifications && candidate.certifications.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {candidate.certifications.map(cert => (
                        <span key={cert} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'interviews' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Interview History</h3>
                  <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm">
                    Schedule Interview
                  </button>
                </div>

                {candidate.interviews.map(interview => (
                  <div key={interview.id} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-white">{formatInterviewStage(interview.stage)}</h4>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getInterviewStageColor(interview.stage)}`}>
                            {interview.stage}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {interview.scheduledAt && new Date(interview.scheduledAt).toLocaleString()}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getInterviewStatusColor(interview.status)}`}>
                        {interview.status}
                      </span>
                    </div>

                    {interview.interviewers.length > 0 && (
                      <div className="mb-3">
                        <div className="text-sm text-gray-400 mb-2">Interviewers:</div>
                        <div className="flex flex-wrap gap-2">
                          {interview.interviewers.map(interviewer => (
                            <div key={interviewer.userId} className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-lg">
                              <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">
                                {interviewer.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="text-sm text-white">{interviewer.name}</span>
                              <span className="text-xs text-gray-400">• {interviewer.role}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {interview.meetingLink && (
                      <div className="flex items-center gap-2 mb-3">
                        <Video className="w-4 h-4 text-blue-400" />
                        <a href={interview.meetingLink} className="text-sm text-blue-400 hover:text-blue-300">
                          Join Meeting
                        </a>
                      </div>
                    )}

                    {interview.feedback && interview.feedback.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="text-sm font-medium text-white mb-2">Feedback:</div>
                        {interview.feedback.map((fb, idx) => (
                          <div key={idx} className="bg-gray-900 rounded-lg p-3 mb-2">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-white font-medium">{fb.interviewerName}</span>
                              <div className="flex items-center gap-1">
                                <Award className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm text-white">{fb.rating}/5</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-300 mb-2">{fb.comments}</p>
                            <div className="flex items-center gap-2">
                              {fb.recommendation === 'strong_yes' || fb.recommendation === 'yes' ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-400" />
                              )}
                              <span className="text-xs text-gray-400">{fb.recommendation}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'assessments' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Assessments</h3>
                  <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm">
                    Assign Assessment
                  </button>
                </div>

                {candidate.assessments.map(assessment => (
                  <div key={assessment.id} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-white mb-1">{assessment.title}</h4>
                        <p className="text-sm text-gray-400">{assessment.description}</p>
                      </div>
                      {assessment.passed !== undefined && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          assessment.passed
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {assessment.passed ? 'Passed' : 'Failed'}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Assigned</div>
                        <div className="text-sm text-white">{new Date(assessment.assignedAt).toLocaleDateString()}</div>
                      </div>
                      {assessment.completedAt && (
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Completed</div>
                          <div className="text-sm text-white">{new Date(assessment.completedAt).toLocaleDateString()}</div>
                        </div>
                      )}
                      {assessment.duration && (
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Duration</div>
                          <div className="text-sm text-white">{assessment.duration} min</div>
                        </div>
                      )}
                      {assessment.percentage !== undefined && (
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Score</div>
                          <div className="text-sm text-white font-medium">{assessment.percentage}%</div>
                        </div>
                      )}
                    </div>

                    {assessment.percentage !== undefined && (
                      <div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              assessment.percentage >= 70 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${assessment.percentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {assessment.notes && (
                      <div className="mt-3 text-sm text-gray-300 italic">
                        "{assessment.notes}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                {/* Notes */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Notes</h3>
                    <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm">
                      Add Note
                    </button>
                  </div>
                  <div className="space-y-3">
                    {candidate.notes.map(note => (
                      <div key={note.id} className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm">
                              {note.createdByName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{note.createdByName}</div>
                              <div className="text-xs text-gray-400">{new Date(note.createdAt).toLocaleString()}</div>
                            </div>
                          </div>
                          {note.isPrivate && (
                            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs">Private</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-300">{note.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email History */}
                {candidate.emails.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Email History</h3>
                    <div className="space-y-2">
                      {candidate.emails.map(email => (
                        <div key={email.id} className="bg-gray-800/50 rounded-lg p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-blue-400" />
                            <div>
                              <div className="text-sm text-white">{email.subject}</div>
                              <div className="text-xs text-gray-400">{new Date(email.sentAt).toLocaleString()}</div>
                            </div>
                          </div>
                          {email.opened && (
                            <span className="text-xs text-green-400">Opened</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-4 space-y-6">
          {/* Applied Position */}
          <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Applied Position</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-400 mb-1">Position</div>
                <div className="text-white font-medium">{candidate.positionTitle}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Department</div>
                <div className="text-white">{candidate.department}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Applied Date</div>
                <div className="text-white">{new Date(candidate.applicationDate).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Source</div>
                <div className="text-white capitalize">{candidate.source}</div>
              </div>
            </div>
          </div>

          {/* Assigned Team */}
          <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Assigned Team</h3>
            <div className="space-y-4">
              {candidate.assignedTo && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
                    {candidate.assignedTo.recruiterName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">{candidate.assignedTo.recruiterName}</div>
                    <div className="text-xs text-gray-400">Recruiter</div>
                  </div>
                </div>
              )}
              {candidate.hiringManager && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {candidate.hiringManager.managerName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">{candidate.hiringManager.managerName}</div>
                    <div className="text-xs text-gray-400">Hiring Manager</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors">
                Download Resume
              </button>
              <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors">
                View Portfolio
              </button>
              <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors">
                Send Message
              </button>
              <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors">
                Move to Next Stage
              </button>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Documents</h3>
            <div className="space-y-2">
              {candidate.resumeUrl && (
                <div className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-white">Resume.pdf</span>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
                </div>
              )}
              {candidate.linkedinUrl && (
                <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <div className="flex items-center justify-between p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <span className="text-sm text-white">LinkedIn Profile</span>
                    <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
