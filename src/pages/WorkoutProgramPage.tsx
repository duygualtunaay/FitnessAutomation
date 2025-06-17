import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  CheckCircle, 
  Clock, 
  Target, 
  Calendar,
  Download,
  Edit3,
  Save,
  X,
  AlertCircle,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';
import { generateWorkoutPlanPDF } from '../utils/pdfGenerator';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  completed: boolean;
  notes: string;
  restTime?: string;
}

interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
  completed: boolean;
}

const WorkoutProgramPage: React.FC = () => {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(0);
  const [editingExercise, setEditingExercise] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');
  const [hasBodyAnalysis, setHasBodyAnalysis] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock workout program data
  const [workoutProgram, setWorkoutProgram] = useState<WorkoutDay[]>([
    {
      day: 'Pazartesi',
      focus: 'Göğüs & Triceps',
      completed: false,
      exercises: [
        { id: '1', name: 'Bench Press', sets: 4, reps: '8-10', completed: false, notes: '', restTime: '2-3 dk' },
        { id: '2', name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', completed: false, notes: '', restTime: '2 dk' },
        { id: '3', name: 'Dips', sets: 3, reps: '12-15', completed: false, notes: '', restTime: '90 sn' },
        { id: '4', name: 'Tricep Pushdowns', sets: 3, reps: '12-15', completed: false, notes: '', restTime: '90 sn' },
        { id: '5', name: 'Close-Grip Bench Press', sets: 3, reps: '10-12', completed: false, notes: '', restTime: '2 dk' }
      ]
    },
    {
      day: 'Salı',
      focus: 'Sırt & Biceps',
      completed: false,
      exercises: [
        { id: '6', name: 'Pull-ups', sets: 4, reps: '6-10', completed: false, notes: '', restTime: '2-3 dk' },
        { id: '7', name: 'Barbell Rows', sets: 4, reps: '8-10', completed: false, notes: '', restTime: '2-3 dk' },
        { id: '8', name: 'Lat Pulldowns', sets: 3, reps: '10-12', completed: false, notes: '', restTime: '2 dk' },
        { id: '9', name: 'Barbell Curls', sets: 3, reps: '10-12', completed: false, notes: '', restTime: '90 sn' },
        { id: '10', name: 'Hammer Curls', sets: 3, reps: '12-15', completed: false, notes: '', restTime: '90 sn' }
      ]
    },
    {
      day: 'Çarşamba',
      focus: 'Dinlenme',
      completed: true,
      exercises: []
    },
    {
      day: 'Perşembe',
      focus: 'Bacak',
      completed: false,
      exercises: [
        { id: '11', name: 'Squats', sets: 4, reps: '8-10', completed: false, notes: '', restTime: '3 dk' },
        { id: '12', name: 'Romanian Deadlifts', sets: 4, reps: '8-10', completed: false, notes: '', restTime: '3 dk' },
        { id: '13', name: 'Leg Press', sets: 3, reps: '12-15', completed: false, notes: '', restTime: '2 dk' },
        { id: '14', name: 'Leg Curls', sets: 3, reps: '12-15', completed: false, notes: '', restTime: '90 sn' },
        { id: '15', name: 'Calf Raises', sets: 4, reps: '15-20', completed: false, notes: '', restTime: '60 sn' }
      ]
    },
    {
      day: 'Cuma',
      focus: 'Omuz & Abs',
      completed: false,
      exercises: [
        { id: '16', name: 'Overhead Press', sets: 4, reps: '8-10', completed: false, notes: '', restTime: '2-3 dk' },
        { id: '17', name: 'Lateral Raises', sets: 3, reps: '12-15', completed: false, notes: '', restTime: '90 sn' },
        { id: '18', name: 'Rear Delt Flyes', sets: 3, reps: '12-15', completed: false, notes: '', restTime: '90 sn' },
        { id: '19', name: 'Plank', sets: 3, reps: '30-60 sn', completed: false, notes: '', restTime: '60 sn' },
        { id: '20', name: 'Russian Twists', sets: 3, reps: '20-30', completed: false, notes: '', restTime: '60 sn' }
      ]
    },
    {
      day: 'Cumartesi',
      focus: 'Cardio',
      completed: false,
      exercises: [
        { id: '21', name: 'Treadmill', sets: 1, reps: '20-30 dk', completed: false, notes: '', restTime: '-' },
        { id: '22', name: 'Cycling', sets: 1, reps: '15-20 dk', completed: false, notes: '', restTime: '-' }
      ]
    },
    {
      day: 'Pazar',
      focus: 'Dinlenme',
      completed: true,
      exercises: []
    }
  ]);

  useEffect(() => {
    const checkBodyAnalysis = async () => {
      if (user) {
        try {
          // Check if user has completed body analysis
          const analysisDoc = await getDoc(doc(db, 'users', user.id, 'bodyAnalysis', 'current'));
          setHasBodyAnalysis(analysisDoc.exists());
          
          // Load existing workout program if available
          const workoutDoc = await getDoc(doc(db, 'users', user.id, 'workoutProgram', 'current'));
          if (workoutDoc.exists()) {
            setWorkoutProgram(workoutDoc.data().program);
          }
        } catch (error) {
          console.error('Error checking body analysis:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    checkBodyAnalysis();
  }, [user]);

  const toggleExerciseCompletion = async (dayIndex: number, exerciseId: string) => {
    const newProgram = [...workoutProgram];
    const exercise = newProgram[dayIndex].exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      exercise.completed = !exercise.completed;
      
      // Check if all exercises in the day are completed
      const allCompleted = newProgram[dayIndex].exercises.every(ex => ex.completed);
      newProgram[dayIndex].completed = allCompleted;
      
      setWorkoutProgram(newProgram);
      
      // Save to Firestore
      if (user) {
        try {
          await setDoc(doc(db, 'users', user.id, 'workoutProgram', 'current'), {
            program: newProgram,
            lastUpdated: new Date()
          });
        } catch (error) {
          console.error('Error saving workout progress:', error);
        }
      }
      
      if (exercise.completed) {
        toast.success(`${exercise.name} tamamlandı!`);
      }
    }
  };

  const saveExerciseNotes = async (dayIndex: number, exerciseId: string) => {
    const newProgram = [...workoutProgram];
    const exercise = newProgram[dayIndex].exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      exercise.notes = tempNotes;
      setWorkoutProgram(newProgram);
      
      // Save to Firestore
      if (user) {
        try {
          await setDoc(doc(db, 'users', user.id, 'workoutProgram', 'current'), {
            program: newProgram,
            lastUpdated: new Date()
          });
        } catch (error) {
          console.error('Error saving exercise notes:', error);
        }
      }
    }
    setEditingExercise(null);
    setTempNotes('');
    toast.success('Not kaydedildi');
  };

  const startEditingNotes = (exerciseId: string, currentNotes: string) => {
    setEditingExercise(exerciseId);
    setTempNotes(currentNotes);
  };

  const cancelEditingNotes = () => {
    setEditingExercise(null);
    setTempNotes('');
  };

  const downloadWorkoutPDF = () => {
    if (!user) return;
    
    const workoutData = {
      weeklyPlan: workoutProgram.map(day => ({
        day: day.day,
        focus: day.focus,
        exercises: day.exercises.map(ex => ({
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          notes: ex.notes || 'Not eklenmedi'
        }))
      }))
    };
    
    generateWorkoutPlanPDF(workoutData, user.name);
    toast.success('Antrenman programı PDF olarak indirildi!');
  };

  const getTodayIndex = () => {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1; // Convert Sunday=0 to Sunday=6, Monday=0
  };

  const todayIndex = getTodayIndex();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) return null;

  // Show prerequisite message if body analysis not completed
  if (!hasBodyAnalysis) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-12">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                Vücut Analizi Gerekli
              </h1>
              <p className="text-gray-400 text-lg mb-8">
                Kişiselleştirilmiş antrenman programınızı oluşturmak için lütfen öncelikle vücut analizinizi tamamlayın.
                AI destekli analiz sonucunda size özel bir program hazırlanacak.
              </p>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-8">
                <div className="flex items-center space-x-2 justify-center">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">
                    Vücut analizi tamamlanmadan genel program gösterilmez
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/vucut-analizi"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                  <Dumbbell className="h-5 w-5" />
                  <span>Vücut Analizini Başlat</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="border-2 border-gray-600 hover:border-gray-500 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-gray-800"
                >
                  Dashboard'a Dön
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Antrenman <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Programım</span>
              </h1>
              <p className="text-gray-400">Kişiselleştirilmiş haftalık antrenman planınız</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <button
                onClick={downloadWorkoutPDF}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>PDF İndir</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Week Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Calendar className="h-6 w-6 text-blue-400" />
              <div>
                <h2 className="text-xl font-bold text-white">Hafta {currentWeek + 1}</h2>
                <p className="text-gray-400">
                  {new Date().toLocaleDateString('tr-TR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })} - {new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR', { 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
                disabled={currentWeek === 0}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
              >
                ← Önceki
              </button>
              <button
                onClick={() => setCurrentWeek(currentWeek + 1)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
              >
                Sonraki →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Workout Days */}
        <div className="grid lg:grid-cols-2 gap-6">
          {workoutProgram.map((day, dayIndex) => (
            <motion.div
              key={dayIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: dayIndex * 0.1 }}
              className={`bg-gray-800/50 backdrop-blur-sm border rounded-2xl p-6 ${
                dayIndex === todayIndex 
                  ? 'border-blue-500 ring-2 ring-blue-500/20' 
                  : 'border-gray-700'
              } ${day.completed ? 'bg-green-500/10 border-green-500/30' : ''}`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    day.completed 
                      ? 'bg-green-500/20 border-2 border-green-500' 
                      : dayIndex === todayIndex
                      ? 'bg-blue-500/20 border-2 border-blue-500'
                      : 'bg-gray-700/50 border-2 border-gray-600'
                  }`}>
                    {day.completed ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <Dumbbell className={`h-6 w-6 ${
                        dayIndex === todayIndex ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                      <span>{day.day}</span>
                      {dayIndex === todayIndex && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          Bugün
                        </span>
                      )}
                    </h3>
                    <p className={`text-sm ${
                      day.completed ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      {day.focus}
                    </p>
                  </div>
                </div>
                {day.completed && (
                  <div className="text-green-400 text-sm font-medium">
                    Tamamlandı ✓
                  </div>
                )}
              </div>

              {day.exercises.length > 0 ? (
                <div className="space-y-4">
                  {day.exercises.map((exercise, exerciseIndex) => (
                    <div
                      key={exercise.id}
                      className={`border rounded-lg p-4 transition-all duration-300 ${
                        exercise.completed 
                          ? 'bg-green-500/10 border-green-500/30' 
                          : 'bg-gray-700/30 border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <button
                            onClick={() => toggleExerciseCompletion(dayIndex, exercise.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                              exercise.completed
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-400 hover:border-green-400'
                            }`}
                          >
                            {exercise.completed && (
                              <CheckCircle className="h-4 w-4 text-white" />
                            )}
                          </button>
                          <div className="flex-1">
                            <h4 className={`font-semibold ${
                              exercise.completed ? 'text-green-400 line-through' : 'text-white'
                            }`}>
                              {exercise.name}
                            </h4>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-gray-400 text-sm">
                                {exercise.sets} set × {exercise.reps}
                              </span>
                              {exercise.restTime && (
                                <span className="text-gray-500 text-sm flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{exercise.restTime}</span>
                                </span>
                              )}
                            </div>
                            
                            {/* Notes Section */}
                            <div className="mt-3">
                              {editingExercise === exercise.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={tempNotes}
                                    onChange={(e) => setTempNotes(e.target.value)}
                                    placeholder="Egzersiz notlarınızı buraya yazın..."
                                    className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500 rounded-lg text-white placeholder-gray-400 text-sm resize-none"
                                    rows={2}
                                  />
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => saveExerciseNotes(dayIndex, exercise.id)}
                                      className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-white text-sm flex items-center space-x-1 transition-colors"
                                    >
                                      <Save className="h-3 w-3" />
                                      <span>Kaydet</span>
                                    </button>
                                    <button
                                      onClick={cancelEditingNotes}
                                      className="bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded text-white text-sm flex items-center space-x-1 transition-colors"
                                    >
                                      <X className="h-3 w-3" />
                                      <span>İptal</span>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    {exercise.notes ? (
                                      <p className="text-gray-300 text-sm bg-gray-600/30 rounded px-2 py-1">
                                        💭 {exercise.notes}
                                      </p>
                                    ) : (
                                      <p className="text-gray-500 text-sm italic">
                                        Not eklenmedi
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => startEditingNotes(exercise.id, exercise.notes)}
                                    className="text-gray-400 hover:text-blue-400 transition-colors ml-2"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Day Progress */}
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">İlerleme:</span>
                      <span className={`font-medium ${
                        day.completed ? 'text-green-400' : 'text-blue-400'
                      }`}>
                        {day.exercises.filter(ex => ex.completed).length} / {day.exercises.length} egzersiz
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          day.completed ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{
                          width: `${(day.exercises.filter(ex => ex.completed).length / day.exercises.length) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">Dinlenme günü</p>
                  <p className="text-gray-500 text-sm">Vücudunuzun toparlanması için önemli</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Weekly Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Haftalık Özet</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {workoutProgram.filter(day => day.completed).length}
              </div>
              <div className="text-gray-400 text-sm">Tamamlanan Gün</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {workoutProgram.reduce((total, day) => 
                  total + day.exercises.filter(ex => ex.completed).length, 0
                )}
              </div>
              <div className="text-gray-400 text-sm">Tamamlanan Egzersiz</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {workoutProgram.reduce((total, day) => total + day.exercises.length, 0)}
              </div>
              <div className="text-gray-400 text-sm">Toplam Egzersiz</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {Math.round((workoutProgram.reduce((total, day) => 
                  total + day.exercises.filter(ex => ex.completed).length, 0
                ) / workoutProgram.reduce((total, day) => total + day.exercises.length, 0)) * 100) || 0}%
              </div>
              <div className="text-gray-400 text-sm">Tamamlanma Oranı</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkoutProgramPage;