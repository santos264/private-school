import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Database,
  Download,
  Copy,
  Check,
  Search,
  RefreshCw,
  Table as TableIcon,
  Code2,
  Network,
  HardDrive,
  Layers,
  FileJson,
  ShieldCheck,
  ExternalLink,
  Info
} from 'lucide-react';

type TableKey = 
  | 'students' 
  | 'teachers' 
  | 'classes' 
  | 'subjects' 
  | 'results' 
  | 'attendance' 
  | 'fees' 
  | 'reportCards' 
  | 'timetable' 
  | 'announcements' 
  | 'adminInviteCodes'
  | 'settings';

export const DatabaseModule: React.FC = () => {
  const {
    students,
    teachers,
    classes,
    subjects,
    results,
    attendance,
    fees,
    reportCards,
    timetable,
    announcements,
    adminInviteCodes,
    settings,
    resetToDefaultData
  } = useSchool();

  const [activeTable, setActiveTable] = useState<TableKey>('students');
  const [viewMode, setViewMode] = useState<'grid' | 'json' | 'schema'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  // Database collections dictionary
  const databaseTables: Record<TableKey, { name: string; description: string; data: any[]; primaryKey: string }> = {
    students: {
      name: 'students',
      description: 'Student master admissions roster, biodata, class assignments, and parent contact information.',
      data: students,
      primaryKey: 'id'
    },
    teachers: {
      name: 'teachers',
      description: 'Academic faculty directory, staff IDs, educational qualifications, and allocated subjects.',
      data: teachers,
      primaryKey: 'id'
    },
    classes: {
      name: 'classes',
      description: 'Secondary class arms (JSS 1 to SS 3), room numbers, capacity limits, and assigned class teachers.',
      data: classes,
      primaryKey: 'id'
    },
    subjects: {
      name: 'subjects',
      description: 'Curriculum course offerings, subject codes, categories (Core, Science, Arts), and applicable levels.',
      data: subjects,
      primaryKey: 'id'
    },
    results: {
      name: 'results',
      description: 'Continuous Assessment (CA 1, CA 2) and examination raw scores with computed grades and ranks.',
      data: results,
      primaryKey: 'id'
    },
    attendance: {
      name: 'attendance',
      description: 'Daily classroom attendance roll call records (Present, Absent, Late, Excused).',
      data: attendance,
      primaryKey: 'id'
    },
    fees: {
      name: 'fees',
      description: 'Student financial ledgers, tuition balances, payment transaction logs, and receipts.',
      data: fees,
      primaryKey: 'id'
    },
    reportCards: {
      name: 'reportCards',
      description: 'Terminal consolidated report cards, psychomotor domain ratings, and principal endorsements.',
      data: reportCards,
      primaryKey: 'id'
    },
    timetable: {
      name: 'timetable',
      description: 'Weekly schedule periods, daily lesson timeslots, subject-room allocations, and teacher schedules.',
      data: timetable,
      primaryKey: 'id'
    },
    announcements: {
      name: 'announcements',
      description: 'School circulars, public notices, urgent bulletins, and target audience metadata.',
      data: announcements,
      primaryKey: 'id'
    },
    adminInviteCodes: {
      name: 'adminInviteCodes',
      description: 'Chief Administrator verification invitation tokens and onboarding dispatches.',
      data: adminInviteCodes,
      primaryKey: 'code'
    },
    settings: {
      name: 'settings',
      description: 'School configuration, active academic session, term calendar, and institutional crest assets.',
      data: [settings],
      primaryKey: 'schoolName'
    }
  };

  const currentTableConfig = databaseTables[activeTable];

  // Total records across database
  const totalRecords = useMemo(() => {
    return Object.values(databaseTables).reduce((acc, t) => acc + (Array.isArray(t.data) ? t.data.length : 1), 0);
  }, [students, teachers, classes, subjects, results, attendance, fees, reportCards, timetable, announcements, adminInviteCodes, settings]);

  // Filtered rows for current table
  const filteredData = useMemo(() => {
    const list = currentTableConfig.data;
    if (!searchTerm.trim()) return list;
    const term = searchTerm.toLowerCase();

    return list.filter((row: any) => {
      return Object.values(row).some((val) => {
        if (typeof val === 'string' || typeof val === 'number') {
          return String(val).toLowerCase().includes(term);
        }
        if (typeof val === 'object' && val !== null) {
          return JSON.stringify(val).toLowerCase().includes(term);
        }
        return false;
      });
    });
  }, [currentTableConfig, searchTerm]);

  // Column headers for active table
  const columns = useMemo(() => {
    if (!currentTableConfig.data || currentTableConfig.data.length === 0) return [];
    return Object.keys(currentTableConfig.data[0]);
  }, [currentTableConfig]);

  // Export entire database as JSON file
  const handleExportDatabase = () => {
    const fullDbPayload = {
      exportedAt: new Date().toISOString(),
      school: settings.schoolName,
      session: settings.currentSession,
      term: settings.currentTerm,
      schemaVersion: '2.6',
      storageEngine: 'HTML5_LocalStorage_sms_db_',
      database: {
        settings,
        students,
        teachers,
        classes,
        subjects,
        results,
        attendance,
        fees,
        reportCards,
        timetable,
        announcements,
        adminInviteCodes
      }
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullDbPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `st_gregory_school_database_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Copy active table JSON
  const handleCopyTableJson = () => {
    const jsonStr = JSON.stringify(currentTableConfig.data, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header & Database Engine Overview */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
              <HardDrive className="w-3.5 h-3.5" />
              <span>Relational Storage Engine · Persistent HTML5 LocalStorage</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Database className="w-7 h-7 text-indigo-400" />
              <span>School Database & Master Schema</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Live database inspector for St. Gregory Memorial College. All student admissions, teacher 
              allocations, attendance registers, continuous assessments, and fee ledgers are synchronized in 
              browser persistent storage under <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono text-xs">sms_db_*</code>.
            </p>
          </div>

          {/* Quick Database Statistics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-700 text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Tables</span>
              <p className="text-xl font-black text-white">{Object.keys(databaseTables).length}</p>
            </div>
            <div className="bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-700 text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Rows</span>
              <p className="text-xl font-black text-emerald-400">{totalRecords}</p>
            </div>
            <div className="bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-700 text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Schema</span>
              <p className="text-xl font-black text-indigo-300">v2.6</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportDatabase}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-xs cursor-pointer"
              title="Download entire school database as JSON backup"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Export Database (JSON Backup)</span>
            </button>

            <button
              onClick={handleCopyTableJson}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all cursor-pointer"
              title="Copy active table records to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Table JSON!' : 'Copy Table JSON'}</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset the database back to default initial seed records? All custom edits will be restored to factory default.')) {
                resetToDefaultData();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 rounded-xl border border-rose-800/50 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Database Seed</span>
          </button>
        </div>
      </div>

      {/* 2. Table Switcher Pills */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {(Object.keys(databaseTables) as TableKey[]).map((key) => {
            const table = databaseTables[key];
            const isActive = activeTable === key;
            const count = Array.isArray(table.data) ? table.data.length : 1;

            return (
              <button
                key={key}
                onClick={() => {
                  setActiveTable(key);
                  setSearchTerm('');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <Layers className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`} />
                <span className="font-mono">{table.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-indigo-800 text-white' : 'bg-white text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Table Header & Search Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                TABLE: {currentTableConfig.name}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                (Primary Key: <strong className="text-slate-700">{currentTableConfig.primaryKey}</strong>)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {currentTableConfig.description}
            </p>
          </div>

          {/* View Mode Switcher & Search */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table Grid</span>
              </button>
              <button
                onClick={() => setViewMode('json')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'json' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Raw JSON</span>
              </button>
              <button
                onClick={() => setViewMode('schema')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'schema' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>Relations</span>
              </button>
            </div>

            {viewMode === 'grid' && (
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Search in ${currentTableConfig.name}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-48 sm:w-56"
                />
              </div>
            )}
          </div>
        </div>

        {/* View Mode 1: Table Grid */}
        {viewMode === 'grid' && (
          <div className="mt-4 overflow-x-auto">
            {filteredData.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No matching records found in table <code className="font-mono">{currentTableConfig.name}</code>.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-mono">
                    <th className="py-2.5 px-3 text-[11px] font-bold">#</th>
                    {columns.map((col) => (
                      <th key={col} className="py-2.5 px-3 text-[11px] font-bold capitalize whitespace-nowrap">
                        {col}
                        {col === currentTableConfig.primaryKey && (
                          <span className="ml-1 text-[9px] bg-indigo-100 text-indigo-700 px-1 py-0.2 rounded font-sans">
                            PK
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="py-2 px-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                      {columns.map((col) => {
                        const val = row[col];
                        return (
                          <td key={col} className="py-2 px-3 text-slate-700 max-w-xs truncate">
                            {typeof val === 'object' && val !== null ? (
                              <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600" title={JSON.stringify(val)}>
                                {Array.isArray(val) ? `[Array(${val.length})]` : '{Object}'}
                              </span>
                            ) : typeof val === 'boolean' ? (
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${val ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                {val ? 'TRUE' : 'FALSE'}
                              </span>
                            ) : (
                              <span className="font-medium">
                                {val !== undefined && val !== null ? String(val) : <span className="text-slate-300">null</span>}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Showing {filteredData.length} of {currentTableConfig.data.length} records</span>
              <span className="font-mono">Database Table: {currentTableConfig.name}</span>
            </div>
          </div>
        )}

        {/* View Mode 2: Raw JSON Explorer */}
        {viewMode === 'json' && (
          <div className="mt-4">
            <div className="flex items-center justify-between pb-2 text-xs text-slate-400">
              <span>Formatted JSON Records ({currentTableConfig.data.length} items)</span>
              <button
                onClick={handleCopyTableJson}
                className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
              >
                {copied ? 'Copied!' : 'Copy this table JSON'}
              </button>
            </div>
            <pre className="p-4 bg-slate-950 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto max-h-[500px] border border-slate-800 scrollbar-thin">
              {JSON.stringify(currentTableConfig.data, null, 2)}
            </pre>
          </div>
        )}

        {/* View Mode 3: Schema & Relational Integrity */}
        {viewMode === 'schema' && (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-indigo-900">
              <h4 className="font-bold flex items-center gap-1.5 mb-1 text-sm text-indigo-950">
                <Network className="w-4 h-4 text-indigo-600" />
                <span>Foreign Key Relationships & Entity Architecture</span>
              </h4>
              <p className="text-slate-600">
                The school database uses relational keys to ensure referential integrity across classes, 
                admissions, continuous assessments, and fee ledgers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h5 className="font-bold text-slate-900 mb-2">Student Entity Dependencies</h5>
                <ul className="space-y-1.5 text-slate-600 list-disc pl-4">
                  <li><strong className="text-slate-800">students.classId</strong> references <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">classes.id</code></li>
                  <li><strong className="text-slate-800">results.studentId</strong> references <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">students.id</code></li>
                  <li><strong className="text-slate-800">attendance.studentId</strong> references <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">students.id</code></li>
                  <li><strong className="text-slate-800">fees.studentId</strong> references <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">students.id</code></li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h5 className="font-bold text-slate-900 mb-2">Class & Subject Allocations</h5>
                <ul className="space-y-1.5 text-slate-600 list-disc pl-4">
                  <li><strong className="text-slate-800">classes.classTeacherId</strong> references <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">teachers.id</code></li>
                  <li><strong className="text-slate-800">results.subjectId</strong> references <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">subjects.id</code></li>
                  <li><strong className="text-slate-800">timetable.teacherId</strong> references <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">teachers.id</code></li>
                  <li><strong className="text-slate-800">timetable.subjectId</strong> references <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">subjects.id</code></li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Local Storage Engine & Code File Location Guide */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-600">
        <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2 text-sm">
          <Info className="w-4 h-4 text-indigo-600" />
          <span>Where the Database Lives: Technical Reference</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <p className="font-semibold text-slate-800">1. Persistent Browser Storage (Runtime)</p>
            <p className="text-slate-500 leading-relaxed">
              Every creation, edit, score update, attendance entry, and payment is saved in the browser’s 
              <strong className="text-slate-700"> HTML5 localStorage</strong> with prefix <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-indigo-600 font-mono">sms_db_*</code>. Data persists across reloads and browser sessions.
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="font-semibold text-slate-800">2. Initial Database Seed File (Source Code)</p>
            <p className="text-slate-500 leading-relaxed">
              The default seed data and schema defaults are defined in:
              <br />
              <code className="bg-white px-2 py-0.5 rounded border border-slate-200 text-indigo-600 font-mono text-[11px] mt-1 inline-block">
                src/data/initialData.ts
              </code>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
