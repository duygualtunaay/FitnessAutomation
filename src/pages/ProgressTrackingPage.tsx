import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar, 
  Weight, 
  Activity, 
  Target,
  Plus,
  Filter
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  TimeScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { format, subDays, subMonths } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface ProgressEntry {
  id?: string;
  date: string;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  workoutDuration: number;
  caloriesBurned: number;
}

const ProgressTrackingPage: React.FC = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<'7days' | '1month' | 'all'>('1month');
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newEntry, setNewEntry] = useState({
    weight: '',
    bodyFat: '',
    muscleMass: '',
    workoutDuration: '',
    caloriesBurned: ''
  });

  const [progressData, setProgressData] = useState<ProgressEntry[]>([
    { date: '2024-01-01', weight: 75.5, bodyFat: 18.2, muscleMass: 35.8, workoutDuration: 45, caloriesBurned: 320 },
    { date: '2024-01-08', weight: 75.2, bodyFat: 17.9, muscleMass: 36.1, workoutDuration: 50, caloriesBurned: 350 },
    { date: '2024-01-15', weight: 74.8, bodyFat: 17.5, muscleMass: 36.4, workoutDuration: 55, caloriesBurned: 380 },
    { date: '2024-01-22', weight: 74.5, bodyFat: 17.2, muscleMass: 36.7, workoutDuration: 48, caloriesBurned: 365 },
    { date: '2024-01-29', weight: 74.2, bodyFat: 16.8, muscleMass: 37.0, workoutDuration: 52, caloriesBurned: 390 },
    { date: '2024-02-05', weight: 73.9, bodyFat: 16.5, muscleMass: 37.3, workoutDuration: 58, caloriesBurned: 410 },
    { date: '2024-02-12', weight: 73.6, bodyFat: 16.2, muscleMass: 37.6, workoutDuration: 60, caloriesBurned: 425 },
    { date: '2024-02-19', weight: 73.3, bodyFat: 15.9, muscleMass: 37.9, workoutDuration: 55, caloriesBurned: 400 },
  ]);

  useEffect(() => {
    loadProgressData();
  }, [user]);

  const loadProgressData = async () => {
    if (!user) return;

    try {
      const progressRef = collection(db, 'users', user.id, 'progress');
      const q = query(progressRef, orderBy('date', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const loadedData: ProgressEntry[] = [];
      querySnapshot.forEach((doc) => {
        loadedData.push({ id: doc.id, ...doc.data() } as ProgressEntry);
      });

      if (loadedData.length > 0) {
        setProgressData(loadedData);
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
  };

  const getFilteredData = () => {
    const now = new Date();
    let startDate: Date;

    switch (dateRange) {
      case '7days':
        startDate = subDays(now, 7);
        break;
      case '1month':
        startDate = subMonths(now, 1);
        break;
      default:
        return progressData;
    }

    return progressData.filter(entry => new Date(entry.date) >= startDate);
  };

  const filteredData = getFilteredData();

  const weightChartData = {
    labels: filteredData.map(entry => format(new Date(entry.date), 'dd MMM', { locale: tr })),
    datasets: [
      {
        label: 'Kilo (kg)',
        data: filteredData.map(entry => entry.weight),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const bodyCompositionChartData = {
    labels: filteredData.map(entry => format(new Date(entry.date), 'dd MMM', { locale: tr })),
    datasets: [
      {
        label: 'Vücut Yağ Oranı (%)',
        data: filteredData.map(entry => entry.bodyFat || 0),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Kas Kütlesi (kg)',
        data: filteredData.map(entry => entry.muscleMass || 0),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const workoutChartData = {
    labels: filteredData.map(entry => format(new Date(entry.date), 'dd MMM', { locale: tr })),
    datasets: [
      {
        label: 'Antrenman Süresi (dk)',
        data: filteredData.map(entry => entry.workoutDuration),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Yakılan Kalori',
        data: filteredData.map(entry => entry.caloriesBurned),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const singleAxisChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
      },
      y: {
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
      },
    },
  };

  const handleAddEntry = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const entry: Omit<ProgressEntry, 'id'> = {
        date: new Date().toISOString().split('T')[0],
        weight: parseFloat(newEntry.weight),
        bodyFat: newEntry.bodyFat ? parseFloat(newEntry.bodyFat) : undefined,
        muscleMass: newEntry.muscleMass ? parseFloat(newEntry.muscleMass) : undefined,
        workoutDuration: parseInt(newEntry.workoutDuration),
        caloriesBurned: parseInt(newEntry.caloriesBurned)
      };

      // Save to Firestore
      const progressRef = collection(db, 'users', user.id, 'progress');
      await addDoc(progressRef, entry);

      // Update local state
      setProgressData(prev => [...prev, entry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      
      setNewEntry({
        weight: '',
        bodyFat: '',
        muscleMass: '',
        workoutDuration: '',
        caloriesBurned: ''
      });
      setShowAddEntry(false);
      toast.success('Veri başarıyla kaydedildi!');
    } catch (error) {
      console.error('Error adding progress entry:', error);
      toast.error('Veri kaydedilirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const getLatestStats = () => {
    if (filteredData.length === 0) return null;
    
    const latest = filteredData[filteredData.length - 1];
    const previous = filteredData.length > 1 ? filteredData[filteredData.length - 2] : null;
    
    return {
      current: latest,
      changes: previous ? {
        weight: latest.weight - previous.weight,
        bodyFat: (latest.bodyFat || 0) - (previous.bodyFat || 0),
        muscleMass: (latest.muscleMass || 0) - (previous.muscleMass || 0),
        workoutDuration: latest.workoutDuration - previous.workoutDuration,
        caloriesBurned: latest.caloriesBurned - previous.caloriesBurned,
      } : null
    };
  };

  const stats = getLatestStats();

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                İlerleme <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Takibi</span>
              </h1>
              <p className="text-gray-400">Fitness yolculuğunuzdaki gelişiminizi takip edin</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-1">
                <Filter className="h-4 w-4 text-gray-400 ml-2" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as any)}
                  className="bg-transparent text-white text-sm focus:outline-none pr-2"
                >
                  <option value="7days">Son 7 Gün</option>
                  <option value="1month">Son 1 Ay</option>
                  <option value="all">Tüm Zamanlar</option>
                </select>
              </div>
              <button
                onClick={() => setShowAddEntry(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Veri Ekle</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Current Stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
              <Weight className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{stats.current.weight} kg</div>
              <div className="text-gray-400 text-sm">Kilo</div>
              {stats.changes && (
                <div className={`text-xs mt-1 ${stats.changes.weight >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {stats.changes.weight >= 0 ? '+' : ''}{stats.changes.weight.toFixed(1)} kg
                </div>
              )}
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
              <Target className="h-6 w-6 text-red-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{stats.current.bodyFat?.toFixed(1)}%</div>
              <div className="text-gray-400 text-sm">Vücut Yağı</div>
              {stats.changes && (
                <div className={`text-xs mt-1 ${stats.changes.bodyFat >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {stats.changes.bodyFat >= 0 ? '+' : ''}{stats.changes.bodyFat.toFixed(1)}%
                </div>
              )}
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
              <TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{stats.current.muscleMass?.toFixed(1)} kg</div>
              <div className="text-gray-400 text-sm">Kas Kütlesi</div>
              {stats.changes && (
                <div className={`text-xs mt-1 ${stats.changes.muscleMass >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.changes.muscleMass >= 0 ? '+' : ''}{stats.changes.muscl eMass.toFixed(1)} kg
                </div>
              )}
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
              <Activity className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{stats.current.workoutDuration} dk</div>
              <div className="text-gray-400 text-sm">Antrenman</div>
              {stats.changes && (
                <div className={`text-xs mt-1 ${stats.changes.workoutDuration >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.changes.workoutDuration >= 0 ? '+' : ''}{stats.changes.workoutDuration} dk
                </div>
              )}
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
              <Calendar className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{stats.current.caloriesBurned}</div>
              <div className="text-gray-400 text-sm">Kalori</div>
              {stats.changes && (
                <div className={`text-xs mt-1 ${stats.changes.caloriesBurned >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.changes.caloriesBurned >= 0 ? '+' : ''}{stats.changes.caloriesBurned}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Weight Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <Weight className="h-6 w-6 text-blue-400" />
              <span>Kilo Değişimi</span>
            </h3>
            <div className="h-64">
              <Line data={weightChartData} options={singleAxisChartOptions} />
            </div>
          </motion.div>

          {/* Body Composition Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <Target className="h-6 w-6 text-green-400" />
              <span>Vücut Kompozisyonu</span>
            </h3>
            <div className="h-64">
              <Line data={bodyCompositionChartData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Workout Performance Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 lg:col-span-2"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <Activity className="h-6 w-6 text-purple-400" />
              <span>Antrenman Performansı</span>
            </h3>
            <div className="h-64">
              <Line data={workoutChartData} options={chartOptions} />
            </div>
          </motion.div>
        </div>

        {/* Add Entry Modal */}
        {showAddEntry && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-6">Yeni Veri Ekle</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Kilo (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newEntry.weight}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="75.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Vücut Yağ Oranı (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newEntry.bodyFat}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, bodyFat: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="18.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Kas Kütlesi (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newEntry.muscleMass}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, muscleMass: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="35.2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Antrenman Süresi (dakika) *
                  </label>
                  <input
                    type="number"
                    value={newEntry.workoutDuration}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, workoutDuration: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="45"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Yakılan Kalori *
                  </label>
                  <input
                    type="number"
                    value={newEntry.caloriesBurned}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, caloriesBurned: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="320"
                  />
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowAddEntry(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg text-white font-medium transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleAddEntry}
                  disabled={!newEntry.weight || !newEntry.workoutDuration || !newEntry.caloriesBurned || isLoading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-4 py-3 rounded-lg text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Kaydediliyor...</span>
                    </>
                  ) : (
                    <span>Ekle</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTrackingPage;