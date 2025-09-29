import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, Calendar, Dumbbell, Target, BarChart3, RotateCcw } from 'lucide-react';

const App = () => {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([
    { id: 1, name: 'Bench Press', category: 'Chest' },
    { id: 2, name: 'Squat', category: 'Legs' },
    { id: 3, name: 'Deadlift', category: 'Back' },
    { id: 4, name: 'Overhead Press', category: 'Shoulders' },
    { id: 5, name: 'Pull-ups', category: 'Back' },
    { id: 6, name: 'Barbell Row', category: 'Back' },
    { id: 7, name: 'Incline Bench Press', category: 'Chest' },
    { id: 8, name: 'Lunges', category: 'Legs' },
  ]);
  
  const [selectedExercise, setSelectedExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [activeTab, setActiveTab] = useState('log');
  const [trainingPlan, setTrainingPlan] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedWorkouts = localStorage.getItem('gymWorkouts');
    const savedExercises = localStorage.getItem('gymExercises');
    
    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts));
    }
    if (savedExercises) {
      setExercises(JSON.parse(savedExercises));
    }
  }, []);

  // Save workouts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gymWorkouts', JSON.stringify(workouts));
  }, [workouts]);

  // Save exercises to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gymExercises', JSON.stringify(exercises));
  }, [exercises]);

  const addWorkout = () => {
    if (!selectedExercise || !weight || !reps) return;
    
    const exercise = exercises.find(ex => ex.id === parseInt(selectedExercise));
    const newWorkout = {
      id: Date.now(),
      exerciseId: parseInt(selectedExercise),
      exerciseName: exercise.name,
      weight: parseFloat(weight),
      reps: parseInt(reps),
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().getTime()
    };
    
    setWorkouts([...workouts, newWorkout]);
    setWeight('');
    setReps('');
  };

  const getProgressData = (exerciseId) => {
    return workouts
      .filter(w => w.exerciseId === exerciseId)
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  const generateTrainingPlan = (muscleGroup) => {
    const muscleExercises = exercises.filter(ex => ex.category === muscleGroup);
    const plan = muscleExercises.map(exercise => ({
      id: exercise.id,
      name: exercise.name,
      sets: Math.floor(Math.random() * 3) + 3, // 3-5 sets
      reps: Math.floor(Math.random() * 5) + 6, // 6-10 reps
    }));
    setTrainingPlan(plan);
  };

  const getOneRepMax = (weight, reps) => {
    return Math.round(weight * (1 + reps / 30));
  };

  const getBestPerformance = (exerciseId) => {
    const exerciseWorkouts = workouts.filter(w => w.exerciseId === exerciseId);
    if (exerciseWorkouts.length === 0) return null;
    
    return exerciseWorkouts.reduce((best, current) => {
      const currentORM = getOneRepMax(current.weight, current.reps);
      const bestORM = best ? getOneRepMax(best.weight, best.reps) : 0;
      return currentORM > bestORM ? current : best;
    }, null);
  };

  const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Dumbbell className="text-blue-400" />
            Gym Progress Tracker
          </h1>
          <p className="text-gray-300">Track your gains and crush your goals</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('log')}
              className={`px-6 py-3 rounded-md transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'log'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Plus size={20} />
              Log Workout
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`px-6 py-3 rounded-md transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'progress'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <TrendingUp size={20} />
              Progress
            </button>
            <button
              onClick={() => setActiveTab('plan')}
              className={`px-6 py-3 rounded-md transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'plan'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Target size={20} />
              Training Plan
            </button>
          </div>
        </div>

        {/* Log Workout Tab */}
        {activeTab === 'log' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800 rounded-xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Plus className="text-blue-400" />
                Log New Workout
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Exercise</label>
                  <select
                    value={selectedExercise}
                    onChange={(e) => setSelectedExercise(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an exercise</option>
                    {exercises.map(exercise => (
                      <option key={exercise.id} value={exercise.id}>
                        {exercise.name} ({exercise.category})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Reps</label>
                    <input
                      type="number"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <button
                  onClick={addWorkout}
                  disabled={!selectedExercise || !weight || !reps}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Add Workout
                </button>
              </div>
            </div>

            {/* Recent Workouts */}
            {workouts.length > 0 && (
              <div className="mt-8 bg-gray-800 rounded-xl p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">Recent Workouts</h3>
                <div className="space-y-3">
                  {[...workouts].reverse().slice(0, 5).map(workout => (
                    <div key={workout.id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h4 className="text-white font-semibold">{workout.exerciseName}</h4>
                        <p className="text-gray-300 text-sm">{workout.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{workout.weight}kg × {workout.reps}</p>
                        <p className="text-blue-400 text-sm">
                          1RM: {getOneRepMax(workout.weight, workout.reps)}kg
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-xl p-6 shadow-2xl mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="text-blue-400" />
                Exercise Progress
              </h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                {exercises.map(exercise => {
                  const progressData = getProgressData(exercise.id);
                  const bestPerformance = getBestPerformance(exercise.id);
                  
                  if (progressData.length === 0) return null;
                  
                  return (
                    <div key={exercise.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-white font-semibold">{exercise.name}</h3>
                          <p className="text-gray-400 text-sm">{exercise.category}</p>
                        </div>
                        {bestPerformance && (
                          <div className="text-right">
                            <p className="text-green-400 text-sm">Best</p>
                            <p className="text-white font-bold">
                              {bestPerformance.weight}kg × {bestPerformance.reps}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        {progressData.slice(-3).map((workout, index) => (
                          <div key={workout.id} className="flex justify-between text-sm">
                            <span className="text-gray-300">{workout.date}</span>
                            <span className="text-white">
                              {workout.weight}kg × {workout.reps} reps
                            </span>
                            <span className="text-blue-400">
                              1RM: {getOneRepMax(workout.weight, workout.reps)}kg
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Training Plan Tab */}
        {activeTab === 'plan' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-xl p-6 shadow-2xl mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Target className="text-blue-400" />
                Generate Training Plan
              </h2>
              
              <div className="mb-6">
                <label className="block text-gray-300 mb-3">Select Muscle Group for Today</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {muscleGroups.map(group => (
                    <button
                      key={group}
                      onClick={() => generateTrainingPlan(group)}
                      className="bg-gray-700 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium"
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>
              
              {trainingPlan.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Today's Training Plan</h3>
                  <div className="space-y-3">
                    {trainingPlan.map((exercise, index) => (
                      <div key={index} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <h4 className="text-white font-semibold">{exercise.name}</h4>
                          <p className="text-gray-300 text-sm">Sets: {exercise.sets} | Reps: {exercise.reps}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">
                            Complete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Sample Plans */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4">Sample Training Plans</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Push Day (Chest & Shoulders)</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Bench Press - 4 sets × 8-10 reps</li>
                    <li>• Overhead Press - 3 sets × 10-12 reps</li>
                    <li>• Incline Bench Press - 3 sets × 10-12 reps</li>
                    <li>• Lateral Raises - 3 sets × 15 reps</li>
                  </ul>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Pull Day (Back & Biceps)</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Pull-ups - 4 sets × 8-12 reps</li>
                    <li>• Barbell Row - 4 sets × 8-10 reps</li>
                    <li>• Deadlift - 3 sets × 5-8 reps</li>
                    <li>• Bicep Curls - 3 sets × 12-15 reps</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
