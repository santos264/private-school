import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Users2,
  PlusCircle,
  Search,
  BookOpen,
  Phone,
  Mail,
  GraduationCap,
  X,
  Edit2
} from 'lucide-react';
import { Teacher } from '../../types';

export const TeachersModule: React.FC = () => {
  const { teachers, classes, subjects, addTeacher, updateTeacher, currentUser } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [formClassId, setFormClassId] = useState<string>('');

  const canEdit = currentUser.role === 'admin';

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setGender('Male');
    setEmail('');
    setPhone('');
    setQualification('');
    setSelectedSubjects([]);
    setSelectedClasses([]);
    setFormClassId('');
    setEditingTeacher(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setFirstName(t.firstName);
    setLastName(t.lastName);
    setGender(t.gender);
    setEmail(t.email);
    setPhone(t.phone);
    setQualification(t.qualification);
    setSelectedSubjects(t.assignedSubjectIds);
    setSelectedClasses(t.assignedClassIds);
    setFormClassId(t.isClassTeacherOf || '');
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) return;

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, {
        firstName,
        lastName,
        gender,
        email,
        phone,
        qualification,
        assignedSubjectIds: selectedSubjects,
        assignedClassIds: selectedClasses,
        isClassTeacherOf: formClassId || undefined,
      });
    } else {
      const staffId = `STF/2026/${Math.floor(10 + Math.random() * 90)}`;
      addTeacher({
        staffId,
        firstName,
        lastName,
        gender,
        email,
        phone,
        qualification,
        assignedClassIds: selectedClasses.length > 0 ? selectedClasses : [classes[0].id],
        assignedSubjectIds: selectedSubjects.length > 0 ? selectedSubjects : [subjects[0].id],
        isClassTeacherOf: formClassId || undefined,
        photoUrl: gender === 'Female' 
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        employmentDate: new Date().toISOString().split('T')[0],
      });
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  const filteredTeachers = teachers.filter((t) => {
    const fullName = `${t.firstName} ${t.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.qualification.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Academic Staff & Teacher Roster
          </h2>
          <p className="text-xs text-slate-500">
            Manage subject specialists, form masters and curriculum allocations
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Academic Staff</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by teacher name, staff ID, subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Teachers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((t) => {
          const formClass = classes.find(c => c.id === t.isClassTeacherOf);
          const teacherSubs = subjects.filter(s => t.assignedSubjectIds.includes(s.id));
          const teacherClasses = classes.filter(c => t.assignedClassIds.includes(c.id));

          return (
            <div key={t.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.photoUrl}
                      alt={t.firstName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {t.firstName} {t.lastName}
                      </h3>
                      <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-medium">
                        {t.staffId}
                      </span>
                    </div>
                  </div>

                  {canEdit && (
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="mt-3 text-xs space-y-1.5 text-slate-600">
                  <p className="font-medium text-slate-800">
                    {t.qualification}
                  </p>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate font-mono text-[11px]">{t.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-[11px]">{t.phone}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-1">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Subjects Taught</span>
                    <span className="text-slate-800 font-medium">
                      {teacherSubs.length > 0 ? teacherSubs.map(s => s.name).join(', ') : 'None assigned'}
                    </span>
                  </div>
                  <div className="pt-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Form Master Duty</span>
                    <span className="text-slate-800 font-semibold">
                      {formClass ? formClass.name : 'Subject Teacher Only'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Teacher Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingTeacher ? 'Update Academic Staff' : 'Register New Academic Teacher'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Qualifications / Degrees</label>
                <input
                  type="text"
                  placeholder="e.g. B.Sc. (Ed) Mathematics, M.Ed Administration"
                  required
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Form Class Assignment (Optional)</label>
                <select
                  value={formClassId}
                  onChange={(e) => setFormClassId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">-- No Form Class (Subject Specialist) --</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold"
                >
                  {editingTeacher ? 'Save Updates' : 'Register Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
